/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminPostItemAddPageCtrl = /** @class */ (function () {
        function AdminPostItemAddPageCtrl($scope, $rootScope, $q, $state, $uibModal, $window, $filter, $timeout, SpinnerService, APP_FOLDER_PATH, AdminActionStatusService, AdminActionService) {
            var _this = this;
            this.$inject = ["$scope", "$rootScope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionStatusService", "AdminActionService", "$uibModal", "APP_FOLDER_PATH", "datePicker", "$window"];
            this.END_OF_DAY = "2359";
            $scope.vm = this;
            this.$q = $q;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
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
            this.scheduleType = "POSTNOW";
            this.showRecurrance = false;
            this.showSchedule = false;
            this.showTimezoneIcon = true;
            this.selectedPopulation = {};
            this.APP_FOLDER_PATH = APP_FOLDER_PATH;
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
            this.recurEditFlag = false;
            this.recurDisableTimeAndTimeZone = false;
            $window.onbeforeunload = function (event) {
                if (_this.dirtyFlag) {
                    return _this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                $window.onbeforeunload = null;
            };
            this.init();
        }
        AdminPostItemAddPageCtrl.prototype.today = function () {
            this.sendTime = new Date();
            this.recurrTime = new Date();
            this.recurrTime.setMinutes(Math.ceil(this.recurrTime.getMinutes() / 30) * 30);
            this.sendTime.setMinutes(Math.ceil(this.sendTime.getMinutes() / 30) * 30);
            this.currentBrowserDate = this.$filter('date')(new Date(), this.$filter("i18n_aip")("default.date.format"));
            this.currentBrowserDate = this.monthCapitalize(this.currentBrowserDate);
        };
        ;
        AdminPostItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            this.recDisplayEndDateType = "OFFSET";
            this.recurFreqeunecyList =
                [{
                        frequency: this.$filter("i18n_aip")("aip.admin.action.postactionItem.recurringPosting.recurr.constant.days"),
                        value: 'DAYS'
                    },
                    {
                        frequency: this.$filter("i18n_aip")("aip.admin.action.postactionItem.recurringPosting.recurr.constant.hours"),
                        value: 'HOURS'
                    }];
            var allPromises = [];
            this.postActionItemInfo = {};
            this.editMode = this.$state.params.isEdit === "true" ? true : false;
            this.postIDvalue = this.$state.params.postIdval;
            angular.element("#actionItemAddOrEdit").css("pointer-events", "auto");
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
                            _this.regeneratePopulation = _this.actionPost1.populationRegenerateIndicator;
                            var postingTimeZone = _this.actionPost1.postingTimeZone.split(" ");
                            _this.defaultTimeZone = _this.$filter("i18n_aip")("timezone." + postingTimeZone[postingTimeZone.length - 1]);
                            for (var k = 0; k < _this.timezones.length; k++) {
                                if (_this.defaultTimeZone === _this.timezones[k].displayNameWithoutOffset) {
                                    _this.setTimezone(_this.timezones[k]);
                                }
                            }
                            if (_this.actionPost1.postingCurrentState === 'Scheduled') {
                                _this.scheduleType = 'SCHEDULE';
                                _this.sendTime = _this.actionPost1.postingDisplayTime;
                                _this.appServerDate = _this.actionPost1.postingScheduleDateTime;
                                _this.appServerTime = _this.actionPost1.scheduledStartTime;
                                _this.appServerTimeZone = angular.element('<div></div>').html(_this.actionPost1.timezoneStringOffset.displayNameWithoutOffset).text();
                            }
                            else {
                                _this.scheduleType = 'RECUR';
                                _this.recurEditFlag = true;
                                angular.element("#actionItemAddOrEdit").css("pointer-events", "none");
                                _this.recurCount = _this.actionPost1.recurringDetails.recurFrequency;
                                _this.displayStartDateOffset = _this.actionPost1.recurringDetails.postingDispStartDays;
                                _this.displayEndDateOffset = _this.actionPost1.recurringDetails.postingDispEndDays;
                                _this.recurranceStartDate = _this.actionPost1.recurringDetails.recurStartDate;
                                _this.recurranceEndDate = _this.actionPost1.recurringDetails.recurEndDate;
                                _this.recurrTime = _this.actionPost1.postingDisplayTime;
                                _this.actionPost1.recurringDetails.postingDispEndDays ? _this.displayEndDateOffset = _this.actionPost1.recurringDetails.postingDispEndDays : _this.recurDisplayEndDate = _this.actionPost1.recurringDetails.postingDisplayEndDate;
                                _this.actionPost1.recurringDetails.postingDisplayEndDate ? _this.recDisplayEndDateType = "EXACT" : _this.recDisplayEndDateType = "OFFSET";
                                _this.sendTime = _this.recurrTime;
                                for (var i = 0; i < _this.recurFreqeunecyList.length; i++) {
                                    if (_this.actionPost1.recurringDetails.recurFrequencyType === _this.recurFreqeunecyList[i].value) {
                                        _this.selectedRecurFrequency = _this.recurFreqeunecyList[i];
                                        _this.recurDisableTimeAndTimeZone = true;
                                    }
                                }
                                _this.getProcessedServerRecurranceStartDate();
                                _this.getProcessedServerRecurranceEndDate();
                            }
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
            var that = this;
            this.$scope.$on("DetectChanges", function (event, args) {
                if (that.dirtyFlag) {
                    that.redirectval = args.state;
                    that.checkChangeDone();
                }
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
            var offset = "(GMT" + ((timeZoneOffset <= 0 ? '+' : '-') + this.pad(parseInt(Math.abs(timeZoneOffset / 60)), 2) + ":" + this.pad(Math.abs(timeZoneOffset % 60), 2)) + ")";
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
            if (this.scheduleType === "RECUR") {
                this.postActionItemInfo.scheduledStartDate = this.recurranceStartDate;
            }
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
        AdminPostItemAddPageCtrl.prototype.getProcessedServerRecurranceEndDate = function () {
            var _this = this;
            var userSelectedVal = {
                "userEnterDate": this.recurranceEndDate,
                "userEnterTime": this.END_OF_DAY,
                "userEnterTimeZone": this.timezone.timezoneId
            };
            this.adminActionStatusService.getProcessedServerDateTimeAndTimezone(userSelectedVal)
                .then(function (response) {
                _this.processedServerDetails = response.data;
                _this.serverRecurEndDate = _this.processedServerDetails.serverDate;
            });
        };
        AdminPostItemAddPageCtrl.prototype.getProcessedServerRecurranceStartDate = function () {
            var _this = this;
            this.sendTime = this.recurrTime;
            this.timeConversion();
            var userSelectedVal = {
                "userEnterDate": this.recurranceStartDate,
                "userEnterTime": this.selectedTime,
                "userEnterTimeZone": this.timezone.timezoneId
            };
            this.adminActionStatusService.getProcessedServerDateTimeAndTimezone(userSelectedVal)
                .then(function (response) {
                _this.processedServerDetails = response.data;
                _this.serverRecurrStartDate = _this.processedServerDetails.serverDate;
                _this.serverRecurStartTime = _this.processedServerDetails.serverTime;
                var recurserverTimeZone = _this.processedServerDetails.serverTimeZone.split(" ");
                _this.serverRecurTimeZone = angular.element('<div></div>').html(recurserverTimeZone[recurserverTimeZone.length - 1]).text();
            });
        };
        AdminPostItemAddPageCtrl.prototype.editPage = function () {
            var _this = this;
            this.modalInstance = this.$uibModal.open({
                templateUrl: this.APP_FOLDER_PATH + "assets/aipApp/admin/action/post/addpost/postAddTemplate.html",
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
            if ((this.scheduleType === 'POSTNOW' || this.scheduleType === 'SCHEDULE') && !this.postActionItemInfo.displayStartDate || this.postActionItemInfo.displayStartDate === null || this.postActionItemInfo.displayStartDate === "") {
                this.errorMessage.startDate = "invalid StartDate";
            }
            else {
                delete this.errorMessage.startDate;
            }
            if ((this.scheduleType === 'POSTNOW' || this.scheduleType === 'SCHEDULE') && !this.postActionItemInfo.displayEndDate || this.postActionItemInfo.displayEndDate === null || this.postActionItemInfo.displayEndDate === "") {
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
            if (this.scheduleType === "RECUR" && this.recurCount || this.recurCount < 0) {
                this.errorMessage.success = "Recurance count cannot be zero ";
            }
            if (this.scheduleType === "RECUR" && !this.recurCount) {
                this.errorMessage.success = "Recurance count cannot be zero ";
            }
            else {
                delete this.errorMessage.success;
            }
            if (this.scheduleType === "RECUR" && this.displayStartDateOffset == null) {
                this.errorMessage.success = "Display Start offset date cannot be empty";
            }
            if (this.scheduleType === "RECUR" && this.displayStartDateOffset < 0) {
                this.errorMessage.success = "Display Start offset date cannot be less than 0";
            }
            if (this.scheduleType === "RECUR" && this.recDisplayEndDateType === "OFFSET" && this.displayEndDateOffset == null) {
                this.errorMessage.success = "Display End date offset cannot be blank";
            }
            if (this.scheduleType === "RECUR" && this.recDisplayEndDateType === "OFFSET" && this.displayEndDateOffset < 0) {
                this.errorMessage.success = "Invalid End date offset";
            }
            if (this.scheduleType === "RECUR" && this.recDisplayEndDateType === "EXACT" && (!this.recurDisplayEndDate || this.recurDisplayEndDate === null || this.recurDisplayEndDate === "")) {
                this.errorMessage.success = "Invalid End dates";
            }
            if (this.scheduleType === "RECUR" && (!this.recurrTime || this.recurrTime === null || this.recurrTime === "")) {
                this.errorMessage.success = "Invalid  time";
            }
            if (this.scheduleType === "RECUR" && (!this.recurranceEndDate || this.recurranceEndDate === null || this.recurranceEndDate === "")) {
                this.errorMessage.success = "Invalid recurr end date";
            }
            if (this.scheduleType === "RECUR" && !this.selectedRecurFrequency) {
                this.errorMessage.success = "Recurrance frequency cannot be more null";
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        AdminPostItemAddPageCtrl.prototype.checkChanges = function () {
            this.dirtyFlag = true;
            this.$rootScope.DataChanged = this.dirtyFlag;
        };
        AdminPostItemAddPageCtrl.prototype.checkChangeDone = function () {
            var that = this;
            if (that.dirtyFlag === true) {
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.actionItem.saveChanges"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    notifications.remove(n);
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    notifications.remove(n);
                    that.dirtyFlag = false;
                    that.$rootScope.DataChanged = false;
                    if (that.redirectval === "NoData") {
                        that.$state.go("admin-post-list");
                    }
                    else {
                        location.href = that.redirectval;
                    }
                });
                notifications.addNotification(n);
            }
            else {
                that.$state.go("admin-post-list");
            }
        };
        AdminPostItemAddPageCtrl.prototype.cancel = function () {
            this.redirectval = "NoData";
            this.checkChangeDone();
        };
        AdminPostItemAddPageCtrl.prototype.monthCapitalize = function (date) {
            var date = date.replace('.', '');
            return date.replace(/\b\w/g, function (month) { return month.toUpperCase(); });
        };
        AdminPostItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            var userSelectedTime;
            this.postNow = this.scheduleType === 'POSTNOW' ? true : false;
            if (this.postNow === true) {
                this.saving = true;
                var userSelectedTime = null;
                var CurrentDateTimeDetails = new Date();
                var currentTime = this.$filter('date')(CurrentDateTimeDetails, 'HHmm');
                this.sendTime = null;
                this.timezone = null;
                this.today();
                this.getDefaultTimeZone();
                this.displayDatetimeZone.dateVal = this.currentBrowserDate;
                this.displayDatetimeZone.timeVal = currentTime.toString();
                this.displayDatetimeZone.timeZoneVal = this.timezone.stringOffset + ' ' + this.timezone.timezoneId;
            }
            else if (this.scheduleType === 'SCHEDULE') {
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
            else {
                if (this.editMode) {
                    this.sendTime = this.recurrTime;
                    this.timeConversion();
                    userSelectedTime = this.selectedTime;
                    this.displayDatetimeZone.dateVal = this.postActionItemInfo.scheduledStartDate;
                    this.displayDatetimeZone.timeVal = userSelectedTime;
                    this.displayDatetimeZone.timeZoneVal = this.timezone.stringOffset + ' ' + this.timezone.timezoneId;
                }
                else {
                    if (this.recurrTime instanceof Date) {
                        userSelectedTime = this.$filter("date")(this.recurrTime, "HHmm");
                    }
                    else {
                        userSelectedTime = this.recurrTime;
                    }
                    this.displayDatetimeZone.dateVal = this.postActionItemInfo.scheduledStartDate;
                    this.displayDatetimeZone.timeVal = userSelectedTime;
                    this.displayDatetimeZone.timeZoneVal = this.timezone.stringOffset + ' ' + this.timezone.timezoneId;
                }
            }
            if (this.scheduleType === 'RECUR') {
                this.postActionItemInfo.scheduledStartDate = this.recurranceStartDate;
                this.enteredDate = this.recurranceStartDate;
                this.adminActionService.saveRecurringActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.regeneratePopulation, this.recurCount, this.selectedRecurFrequency, this.displayStartDateOffset, this.recDisplayEndDateType, this.displayEndDateOffset, this.recurDisplayEndDate, this.recurranceStartDate, this.recurranceEndDate, userSelectedTime, this.timezone.timezoneId, this.displayDatetimeZone)
                    .then(function (response) {
                    _this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        _this.dirtyFlag = false;
                        _this.$rootScope.DataChanged = false;
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
            }
            else {
                this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow, userSelectedTime, this.timezone.timezoneId, this.regeneratePopulation, this.displayDatetimeZone)
                    .then(function (response) {
                    _this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        _this.dirtyFlag = false;
                        _this.$rootScope.DataChanged = false;
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
            }
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
angular.module("bannerAIP").controller("AdminPostItemAddPageCtrl", AIP.AdminPostItemAddPageCtrl);
