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
            this.modalInstance;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.selected = {};
            this.modalResult = {};
            this.modalResults = [];
            this.regeneratePopulation = false;
            this.itemLength;
            this.scheduleDate = false;
            this.selectedPopulation = {};
            this.postNow = true;
            this.APP_ROOT = APP_ROOT;
            this.errorMessage = {};
            this.init();
        }
        AdminPostItemAddPageCtrl.prototype.groupFunc = function (item) {
            return item.folderName;
        };
        AdminPostItemAddPageCtrl.prototype.populationFunc = function (item) {
            return item.populationFolderName;
        };
        AdminPostItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
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
            this.$q.all(allPromises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
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
            this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow, this.regeneratePopulation)
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
