/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminPostItemAddPageCtrl = (function () {
        function AdminPostItemAddPageCtrl($scope, $q, $state, $uibModal, $filter, $timeout, SpinnerService, APP_ROOT, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionService", "$uibModal", "APP_ROOT", "datePicker"];
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
                _this.spinnerService.showSpinner(false);
            });
        };
        /*ShowPassport(value) {
        this.IsVisible = value == "Y";
                console.log(value)
    }*/
        AdminPostItemAddPageCtrl.prototype.changedValue = function () {
            var _this = this;
            this.itemLength = 0;
            this.modalResult = [];
            var groupId = this.$scope;
            console.log(this.$scope);
            console.log(this.selected.folderName);
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
            console.log(this.sendTime);
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
            console.log(this.timezone);
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
        AdminPostItemAddPageCtrl.prototype.cancel = function () {
            this.$state.go("admin-post-list");
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
