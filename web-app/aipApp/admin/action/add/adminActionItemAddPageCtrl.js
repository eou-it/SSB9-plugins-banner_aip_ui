/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemAddPageCtrl = (function () {
        function AdminActionItemAddPageCtrl($scope, $q, $state, $filter, $timeout, SpinnerService, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionService"];
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.errorMessage = {};
            this.init();
        }
        AdminActionItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.actionItemInfo = {};
            allPromises.push(this.adminActionService.getStatus()
                .then(function (response) {
                _this.status = response.data;
                angular.forEach(_this.status, function (key, value) {
                    key.value = "aip.status." + key.value.charAt(0);
                    console.log(key.value);
                    return value;
                });
                var actionItemStatus = $("#actionItemStatus");
                _this.actionItemInfo.status = _this.status[0];
                _this.$timeout(function () {
                    actionItemStatus.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });
                }, 50);
            }));
            allPromises.push(this.adminActionService.getFolder()
                .then(function (response) {
                _this.folders = response.data;
                var actionItemFolder = $("#actionItemFolder");
                _this.actionItemInfo.folder = _this.folders[0];
                _this.$timeout(function () {
                    actionItemFolder.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });
                }, 50);
            }));
            this.$q.all(allPromises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminActionItemAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            /*if(!this.actionItemInfo.name || this.actionItemInfo.name === null || this.actionItemInfo.name === "" || this.actionItemInfo.title.name > 300) {
                this.errorMessage.name = "invalid title";
            } else {
                delete this.errorMessage.name;
            }*/
            if (!this.actionItemInfo.folder) {
                this.errorMessage.folder = "invalid folder";
            }
            else {
                delete this.errorMessage.folder;
            }
            if (!this.actionItemInfo.description || this.actionItemInfo.description === null || this.actionItemInfo.description === "") {
                this.errorMessage.description = "invalid description";
            }
            else {
                delete this.errorMessage.description;
            }
            if (!this.actionItemInfo.title || this.actionItemInfo.title === null || this.actionItemInfo.title === "" || this.actionItemInfo.title.length > 300) {
                this.errorMessage.title = "invalid title";
            }
            else {
                delete this.errorMessage.title;
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        AdminActionItemAddPageCtrl.prototype.cancel = function () {
            this.$state.go("admin-action-list");
        };
        AdminActionItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.adminActionService.saveActionItem(this.actionItemInfo)
                .then(function (response) {
                _this.saving = false;
                var notiParams = {};
                if (response.data.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response.data
                    };
                    _this.$state.go("admin-action-open", { noti: notiParams, data: response.data.newActionItem.id });
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
        AdminActionItemAddPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return AdminActionItemAddPageCtrl;
    }());
    AIP.AdminActionItemAddPageCtrl = AdminActionItemAddPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemAddPageCtrl", AIP.AdminActionItemAddPageCtrl);
