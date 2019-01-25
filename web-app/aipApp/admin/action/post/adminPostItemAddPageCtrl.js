/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminPostItemAddPageCtrl = /** @class */ (function () {
        function AdminPostItemAddPageCtrl($scope, $q, $state, $uibModal, $filter, $timeout, SpinnerService, APP_ROOT, AdminActionStatusService, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionStatusService", "AdminActionService", "$uibModal", "APP_ROOT", "datePicker"];
            $scope.vm = this;
            this.$q = $q;
            this.$scope = $scope;
            this.$state = $state;
            this.$filter = $filter;
            this.$uibModal = $uibModal;
            this.modalInstance = null;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.adminActionStatusService = AdminActionStatusService;
            this.saving = false;
            this.IsVisible = false;
            this.localeDate = {};
            this.localeTimezone = {};
            this.selected = {};
            this.localeTime = {};
            this.modalResult = {};
            this.modalResults = [];
            this.regeneratePopulation = false;
            this.itemLength = 0;
            this.sendTime = {};
            this.scheduleDate = null;
            this.postNow = true;
            this.showTimezoneIcon = true;
            this.selectedPopulation = {};
            this.APP_ROOT = APP_ROOT;
            this.errorMessage = {};
            this.editMode = false;
            this.changeFlag = false;
            this.actionPost1 = {};
            this.postIDvalue = 0;
            this.dirtyFlag = false;
            this.selectedActionListVal = [];
            this.displayDatetimeZone = {};
            this.defaultTimeZoneNameWithOffset = null;
            this.serverinfo = {};
            this.appServerDate = null;
            this.appServerTime = null;
            this.appServerTimeZone = null;
            this.processedServerDetails = {};
            this.currentBrowserDate = null;
            this.selectedTime = null;
            this.enteredDate = null;
            this.init();
        }
        AdminPostItemAddPageCtrl.prototype.today = function () {
            this.sendTime = new Date();
            this.sendTime.setMinutes(Math.ceil(this.sendTime.getMinutes() / 30) * 30);
            this.currentBrowserDate = this.$filter('date')(new Date(), this.$filter("i18n_aip")("default.date.format"));
            this.currentBrowserDate = this.monthCapitalize(this.currentBrowserDate);
        };
        ;
        AdminPostItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.postActionItemInfo = {};
            this.editMode = this.$state.params.isEdit === "true" ? true : false;
            this.postIDvalue = this.$state.params.postIdval;
            allPromises.push(this.adminActionService.getGrouplist()
                .then(function (response) {
                _this.groupList = response.data;
                _this.postActionItemInfo.group = _this.groupList;
            }));
            allPromises.push(this.adminActionService.getPopulationlist()
                .then(function (response) {
                _this.populationList = response.data;
                _this.postActionItemInfo.population = _this.populationList;
            }));
            allPromises.push(this.adminActionService.getCurrentDateLocale()
                .then(function (response) {
                _this.localeDate = response.data;
                _this.postActionItemInfo.localeDate = _this.localeDate.date;
            }));
            allPromises.push(this.adminActionService.getCurrentTimeLocale()
                .then(function (response) {
                _this.localeTime = response.data.use12HourClock;
                _this.postActionItemInfo.localeTime = _this.localeTime;
            }));
            allPromises.push(this.adminActionService.getCurrentTimeZoneLocale()
                .then(function (response) {
                var that = _this;
                _this.timezones = response.data.timezones;
                if (!_this.editMode) {
                    _this.getDefaultTimeZone();
                }
            }));
            this.$q.all(allPromises).then(function () {
                if (_this.editMode) {
                    _this.adminActionService.getJobDetails(_this.$state.params.postIdval)
                        .then(function (response) {
                        if (response) {
                            _this.$scope.group = {};
                            _this.$scope.population = {};
                            _this.actionPost1 = response;
                            _this.postActionItemInfo.postId = _this.actionPost1.postingId;
                            _this.postActionItemInfo.name = _this.actionPost1.postingName;
                            _this.specialCharacterTranslation();
                            for (var i = 0; i < _this.postActionItemInfo.group.length; i++) {
                                if (_this.postActionItemInfo.group[i].groupName === _this.actionPost1.groupName) {
                                    _this.$scope.group = _this.postActionItemInfo.group[i];
                                }
                            }
                            for (var k = 0; k < _this.postActionItemInfo.population.length; k++) {
                                if (_this.postActionItemInfo.population[k].name === _this.actionPost1.postingPopulation) {
                                    _this.$scope.population = _this.postActionItemInfo.population[k];
                                }
                            }
                            _this.selected = _this.$scope.group;
                            _this.selectedPopulation = _this.$scope.population;
                            _this.postActionItemInfo.groupName = _this.actionPost1.groupName;
                            _this.postActionItemInfo.displayStartDate = _this.actionPost1.postingDisplayStartDate;
                            _this.postActionItemInfo.displayEndDate = _this.actionPost1.postingDisplayEndDate;
                            _this.postActionItemInfo.scheduledStartDate = _this.actionPost1.postingDisplayDateTime;
                            _this.postNow = false;
                            _this.regeneratePopulation = _this.actionPost1.populationRegenerateIndicator;
                            _this.sendTime = _this.actionPost1.postingDisplayTime;
                            var postingTimeZone = _this.actionPost1.postingTimeZone.split(" ");
                            _this.defaultTimeZone = _this.$filter("i18n_aip")("timezone." + postingTimeZone[postingTimeZone.length - 1]);
                            for (var k = 0; k < _this.timezones.length; k++) {
                                if (_this.defaultTimeZone === _this.timezones[k].displayNameWithoutOffset) {
                                    _this.setTimezone(_this.timezones[k]);
                                }
                            }
                            _this.appServerDate = _this.actionPost1.postingScheduleDateTime;
                            _this.appServerTime = _this.actionPost1.scheduledStartTime;
                            _this.appServerTimeZone = angular.element('<div></div>').html(_this.actionPost1.timezoneStringOffset.displayNameWithoutOffset).text();
                            _this.changedValue();
                            _this.adminActionStatusService.getActionItemsById(_this.$state.params.postIdval)
                                .then(function (response) {
                                _this.selectedActionListVal = response.data;
                                _this.itemLength = _this.selectedActionListVal.length;
                                _this.selectedActionListVal.forEach(function (item, index) {
                                    _this.modalResult = item;
                                    _this.modalResults.push(_this.modalResult.actionItemId);
                                });
                            });
                        }
                        else {
                            //todo: output error in notification center?
                            console.log("fail");
                        }
                    }, function (err) {
                        //TODO:: handle error call
                        console.log(err);
                    });
                }
                else {
                    _this.today();
                    _this.getProcessedServerDateTimeAndTimezone();
                }
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminPostItemAddPageCtrl.prototype.specialCharacterTranslation = function () {
            for (var j = 0; j < this.postActionItemInfo.population.length; j++) {
                if (this.postActionItemInfo.population[j].name.indexOf('&amp;') > -1) {
                    this.postActionItemInfo.population[j].name = this.postActionItemInfo.population[j].name.replace("&amp;", "&");
                }
                if (this.postActionItemInfo.population[j].name.indexOf('&quot;') > -1) {
                    this.postActionItemInfo.population[j].name = this.postActionItemInfo.population[j].name.replace("&quot;", "\"");
                }
                if ((this.postActionItemInfo.population[j].name.indexOf('&#039;') > -1) || (this.postActionItemInfo.population[j].name.indexOf('&#39;') > -1)) {
                    this.postActionItemInfo.population[j].name = this.postActionItemInfo.population[j].name.replace("&#039;", "\'");
                    this.postActionItemInfo.population[j].name = this.postActionItemInfo.population[j].name.replace("&#39;", "\'");
                }
                if (this.postActionItemInfo.population[j].name.indexOf('&lt;') > -1) {
                    this.postActionItemInfo.population[j].name = this.postActionItemInfo.population[j].name.replace("&lt;", "<");
                }
                if (this.postActionItemInfo.population[j].name.indexOf('&gt;') > -1) {
                    this.postActionItemInfo.population[j].name = this.postActionItemInfo.population[j].name.replace("&gt;", ">");
                }
            }
        };
        AdminPostItemAddPageCtrl.prototype.changedValue = function () {
            var _this = this;
            this.changeFlag = true;
            this.itemLength = 0;
            this.modalResult = [];
            this.adminActionService.getGroupActionItem(this.selected.groupId)
                .then(function (response) {
                _this.actionItemList = response.data;
                _this.postActionItemInfo["groupAction"] = [];
                _this.postActionItemInfo.groupAction = _this.actionItemList;
            });
        };
        AdminPostItemAddPageCtrl.prototype.showTimeZoneList = function () {
            this.showTimezoneIcon = false;
        };
        ;
        AdminPostItemAddPageCtrl.prototype.pad = function (number, length) {
            var str = "" + number;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        };
        AdminPostItemAddPageCtrl.prototype.setTimezone = function (timezone) {
            this.timezone = timezone;
        };
        ;
        AdminPostItemAddPageCtrl.prototype.getDefaultTimeZone = function () {
            var that = this;
            var timeZoneOffset = new Date().getTimezoneOffset();
            var offset = "(GMT" + ((timeZoneOffset < 0 ? '+' : '-') + this.pad(parseInt(Math.abs(timeZoneOffset / 60)), 2) + ":" + this.pad(Math.abs(timeZoneOffset % 60), 2)) + ")";
            var finalValue = '';
            var timeZone = '';
            angular.forEach(this.timezones, function (key, value) {
                var GMTString = key.stringOffset;
                if (offset === GMTString) {
                    that.setTimezone(key);
                    finalValue = '( ' + key.displayNameWithoutOffset + ' )';
                    timeZone = key.displayName;
                }
            });
            this.defaultTimeZoneNameWithOffset = timeZone;
            this.defaultTimeZone = finalValue;
        };
        AdminPostItemAddPageCtrl.prototype.timeConversion = function () {
            this.enteredDate = (this.postActionItemInfo.scheduledStartDate === undefined) ? this.currentBrowserDate : this.postActionItemInfo.scheduledStartDate;
            if (this.sendTime instanceof Date) {
                this.selectedTime = this.$filter("date")(this.sendTime, "HHmm");
            }
            else if (!(this.sendTime instanceof Date) && (this.sendTime.indexOf(':') > -1)) {
                var timewithmodifier = this.sendTime.split(' ');
                var time = timewithmodifier[0];
                var modifier = timewithmodifier[1];
                var hourmin = time.split(":");
                var hour = hourmin[0];
                var min = hourmin[1];
                if (hour === '12') {
                    hour = '00';
                }
                if (modifier === 'PM') {
                    hour = parseInt(hour) + 12;
                }
                this.selectedTime = hour + min;
            }
            else {
                this.selectedTime = this.sendTime;
            }
        };
        AdminPostItemAddPageCtrl.prototype.getProcessedServerDateTimeAndTimezone = function () {
            var _this = this;
            this.timeConversion();
            var userSelectedVal = {
                "userEnterDate": this.enteredDate,
                "userEnterTime": this.selectedTime,
                "userEnterTimeZone": this.timezone.timezoneId
            };
            this.adminActionStatusService.getProcessedServerDateTimeAndTimezone(userSelectedVal)
                .then(function (response) {
                _this.processedServerDetails = response.data;
                _this.appServerDate = (_this.postActionItemInfo.scheduledStartDate !== undefined) ? _this.processedServerDetails.serverDate : null;
                _this.appServerTime = _this.processedServerDetails.serverTime;
                var serverTimeZone = _this.processedServerDetails.serverTimeZone.split(" ");
                _this.appServerTimeZone = angular.element('<div></div>').html(serverTimeZone[serverTimeZone.length - 1]).text();
            });
        };
        AdminPostItemAddPageCtrl.prototype.editPage = function () {
            var _this = this;
            this.modalInstance = this.$uibModal.open({
                templateUrl: this.APP_ROOT + "admin/action/post/addpost/postAddTemplate.html",
                controller: "PostAddModalCtrl",
                controllerAs: "$ctrl",
                size: "md",
                windowClass: "aip-modal",
                resolve: {
                    actionItemModal: function () {
                        return _this.postActionItemInfo.groupAction;
                    },
                    actionGroupModal: function () {
                        return _this.selected.groupName;
                    },
                    actionFolderGroupModal: function () {
                        return _this.selected.folderName;
                    },
                    EditMode: function () {
                        return _this.editMode;
                    },
                    PostId: function () {
                        return _this.postIDvalue;
                    },
                    selectedActionItemList: function () {
                        return _this.selectedActionListVal;
                    },
                    ChangeFlag: function () {
                        return _this.changeFlag;
                    }
                }
            });
            this.modalInstance.result.then(function (result) {
                _this.modalResults = [];
                _this.itemLength = result.length;
                result.forEach(function (item, index) {
                    _this.modalResult = item;
                    _this.modalResults.push(_this.modalResult.actionItemId);
                });
                if (_this.editMode) {
                    _this.dirtyFlag = true;
                }
            }, function (error) {
                console.log(error);
            });
        };
        AdminPostItemAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            if (this.itemLength === 0) {
                return false;
            }
            if (!this.postActionItemInfo.name || this.postActionItemInfo.name === null || this.postActionItemInfo.name === "") {
                this.errorMessage.name = "invalid title";
            }
            else {
                delete this.errorMessage.name;
            }
            if (!this.postActionItemInfo.displayStartDate || this.postActionItemInfo.displayStartDate === null || this.postActionItemInfo.displayStartDate === "") {
                this.errorMessage.startDate = "invalid StartDate";
            }
            else {
                delete this.errorMessage.startDate;
            }
            if (!this.postActionItemInfo.displayEndDate || this.postActionItemInfo.displayEndDate === null || this.postActionItemInfo.displayEndDate === "") {
                this.errorMessage.endDate = "invalid EndDate";
            }
            else {
                delete this.errorMessage.endDate;
            }
            if (!this.selected) {
                this.errorMessage.postGroupId = "invalid group";
            }
            else {
                delete this.errorMessage.postGroupId;
            }
            if (!this.selectedPopulation) {
                this.errorMessage.population = "invalid population";
            }
            else {
                delete this.errorMessage.population;
            }
            if (!this.modalResult) {
                this.errorMessage.success = "invalid actionItem";
            }
            else {
                delete this.errorMessage.success;
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        AdminPostItemAddPageCtrl.prototype.checkChanges = function () {
            var that = this;
            if (that.editMode) {
                that.dirtyFlag = true;
            }
        };
        AdminPostItemAddPageCtrl.prototype.cancel = function () {
            var that = this;
            if (that.editMode === true && that.dirtyFlag === true) {
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.common.action.post.status.edit.warning"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    that.$state.go("admin-post-list");
                    notifications.remove(n);
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    that.save();
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else {
                that.$state.go("admin-post-list");
            }
        };
        AdminPostItemAddPageCtrl.prototype.monthCapitalize = function (date) {
            var date = date.replace('.', '');
            return date.replace(/\b\w/g, function (month) { return month.toUpperCase(); });
        };
        AdminPostItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            var userSelectedTime = null;
            if (this.postNow === true) {
                this.sendTime = null;
                this.timezone = null;
                var CurrentDateTimeDetails = new Date();
                var currentTime = this.$filter('date')(CurrentDateTimeDetails, 'HHmm');
                this.getDefaultTimeZone();
                this.displayDatetimeZone.dateVal = this.currentBrowserDate;
                this.displayDatetimeZone.timeVal = currentTime.toString();
                this.displayDatetimeZone.timeZoneVal = this.timezone.stringOffset + ' ' + this.timezone.timezoneId;
            }
            else {
                if (this.editMode && !(this.sendTime instanceof Date)) {
                    if (this.selectedTime) {
                        userSelectedTime = this.selectedTime;
                    }
                    else {
                        this.timeConversion();
                        userSelectedTime = this.selectedTime;
                    }
                    this.displayDatetimeZone.dateVal = this.postActionItemInfo.scheduledStartDate;
                    this.displayDatetimeZone.timeVal = this.selectedTime;
                    this.displayDatetimeZone.timeZoneVal = this.timezone.stringOffset + ' ' + this.timezone.timezoneId;
                }
                else {
                    if (this.sendTime instanceof Date) {
                        userSelectedTime = this.$filter("date")(this.sendTime, "HHmm");
                    }
                    else {
                        userSelectedTime = this.sendTime;
                    }
                    this.displayDatetimeZone.dateVal = this.postActionItemInfo.scheduledStartDate;
                    this.displayDatetimeZone.timeVal = this.selectedTime;
                    this.displayDatetimeZone.timeZoneVal = this.timezone.stringOffset + ' ' + this.timezone.timezoneId;
                }
            }
            this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow, userSelectedTime, this.timezone.timezoneId, this.regeneratePopulation, this.displayDatetimeZone)
                .then(function (response) {
                _this.saving = false;
                var notiParams = {};
                if (response.data.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response.data
                    };
                    _this.$state.go("admin-post-list", { noti: notiParams, data: response.data.savedJob.id });
                }
                else {
                    _this.saveErrorCallback(response.data.message);
                }
            }, function (err) {
                _this.saving = false;
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminPostItemAddPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return AdminPostItemAddPageCtrl;
    }());
    AIP.AdminPostItemAddPageCtrl = AdminPostItemAddPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminPostItemAddPageCtrl", AIP.AdminPostItemAddPageCtrl);
