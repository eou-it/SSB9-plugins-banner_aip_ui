/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminPostItemAddPageCtrl = (function () {
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
            this.init();
        }
        AdminPostItemAddPageCtrl.prototype.today = function () {
            this.sendTime = new Date();
            this.sendTime.setMinutes(Math.ceil(this.sendTime.getMinutes() / 30) * 30);
        };
        ;
        AdminPostItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            var deferred = this.$q.defer();
            this.postActionItemInfo = {};
            this.editMode = this.$state.params.isEdit === "true" ? true : false;
            this.postIDvalue = this.$state.params.postIdval;
            allPromises.push(this.adminActionService.getGrouplist()
                .then(function (response) {
                _this.groupList = response.data;
                var postActionItemGroup = $("#postActionItemGroup");
                //this.postActionItemInfo["group"] = [];
                _this.postActionItemInfo.group = _this.groupList;
            }));
            allPromises.push(this.adminActionService.getPopulationlist()
                .then(function (response) {
                _this.populationList = response.data;
                var postActionItemPopulation = $("#postActionItemPopulation");
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
                _this.today();
            }));
            allPromises.push(this.adminActionService.getCurrentTimeZoneLocale()
                .then(function (response) {
                var that = _this;
                _this.timezones = response.data.timezones;
                var timeZoneOffset = new Date().getTimezoneOffset();
                var offset = "(GMT" + ((timeZoneOffset < 0 ? '+' : '-') + _this.pad(parseInt(Math.abs(timeZoneOffset / 60)), 2) + ":" + _this.pad(Math.abs(timeZoneOffset % 60), 2)) + ")";
                //this.defaultTimeZone = offset;
                var finalValue = '';
                angular.forEach(_this.timezones, function (key, value) {
                    var GMTString = key.stringOffset;
                    if (offset === GMTString) {
                        that.setTimezone(key);
                        finalValue = '( ' + key.displayNameWithoutOffset + ' )';
                    }
                });
                _this.defaultTimeZone = finalValue;
            }));
            this.$q.all(allPromises).then(function () {
                if (_this.editMode) {
                    _this.adminActionService.getJobDetails(_this.$state.params.postIdval)
                        .then(function (response) {
                        if (response) {
                            _this.$scope.group = {};
                            _this.$scope.population = {};
                            _this.actionPost1 = response;
                            _this.postActionItemInfo.id = _this.actionPost1.postingId;
                            _this.postActionItemInfo.name = _this.actionPost1.postingName;
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
                            _this.postActionItemInfo.startDate = _this.actionPost1.postingDisplayStartDate;
                            _this.postActionItemInfo.endDate = _this.actionPost1.postingDisplayEndDate;
                            _this.postActionItemInfo.localeDate = _this.actionPost1.postingScheduleDateTime;
                            _this.postNow = false;
                            _this.regeneratePopulation = _this.actionPost1.populationRegenerateIndicator;
                            if (_this.postActionItemInfo.localeTime) {
                                var timeString = _this.actionPost1.scheduledStartTime;
                                var hourEnd = timeString.indexOf(":");
                                var H = +timeString.substr(0, hourEnd);
                                var h = H % 12 || 12;
                                var ampm = H < 12 ? "AM" : "PM";
                                timeString = h + timeString.substr(hourEnd, 3) + ampm;
                                _this.sendTime = timeString;
                            }
                            else {
                                _this.sendTime = _this.actionPost1.scheduledStartTime;
                            }
                            _this.timezone = _this.actionPost1.timezoneStringOffset.ID;
                            _this.changedValue();
                            _this.adminActionStatusService.getActionItemsById(_this.$state.params.postIdval)
                                .then(function (response) {
                                _this.selectedActionListVal = response.data;
                                _this.itemLength = _this.selectedActionListVal.length;
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
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminPostItemAddPageCtrl.prototype.changedValue = function () {
            var _this = this;
            this.changeFlag = true;
            this.itemLength = 0;
            this.modalResult = [];
            var groupId = this.$scope;
            this.adminActionService.getGroupActionItem(this.selected.groupId)
                .then(function (response) {
                _this.actionItemList = response.data;
                var postActionItemGroup = $("#ActionItemGroup");
                _this.postActionItemInfo["groupAction"] = [];
                _this.postActionItemInfo.groupAction = _this.actionItemList;
            });
        };
        AdminPostItemAddPageCtrl.prototype.setTime = function (time) {
            this.sendTime = time;
            this.sendTime = this.$filter('date')(this.sendTime, 'HHmm');
        };
        ;
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
                },
            });
            this.modalInstance.result.then(function (result) {
                console.log(result);
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
        AdminPostItemAddPageCtrl.prototype.start = function () {
            console.log(this.postActionItemInfo.startDate);
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
            if (!this.postActionItemInfo.startDate || this.postActionItemInfo.startDate === null || this.postActionItemInfo.startDate === "") {
                this.errorMessage.startDate = "invalid StartDate";
            }
            else {
                delete this.errorMessage.startDate;
            }
            if (!this.postActionItemInfo.endDate || this.postActionItemInfo.endDate === null || this.postActionItemInfo.endDate === "") {
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
            if (!this.modalResult == null) {
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
                    type: "warning",
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    that.$state.go("admin-post-list");
                    notifications.remove(n);
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                });
                notifications.addNotification(n);
            }
            else {
                that.$state.go("admin-post-list");
            }
        };
        AdminPostItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            if (this.postNow === true) {
                this.sendTime = null;
                this.timezone.timezoneId = null;
            }
            this.sendTime = this.$filter("date")(this.sendTime, "HHmm");
            this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow, this.sendTime, this.timezone.timezoneId, this.regeneratePopulation)
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
