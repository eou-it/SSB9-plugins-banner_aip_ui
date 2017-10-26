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
                console.log(_this.groupList);
                var postActionItemGroup = $("#postActionItemGroup");
                //this.postActionItemInfo["group"] = [];
                _this.postActionItemInfo.group = _this.groupList;
                console.log(_this.postActionItemInfo.group);
            }));
            allPromises.push(this.adminActionService.getPopulationlist()
                .then(function (response) {
                _this.populationList = response.data;
                console.log(_this.groupList);
                var postActionItemPopulation = $("#postActionItemPopulation");
                _this.postActionItemInfo.population = _this.populationList;
            }));
            this.$q.all(allPromises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminPostItemAddPageCtrl.prototype.changedValue = function (item) {
            var _this = this;
            this.$scope = item.groupId;
            var groupId = this.$scope;
            console.log(this.$scope);
            this.adminActionService.getGroupActionItem(groupId)
                .then(function (response) {
                _this.actionItemList = response.data;
                console.log(_this.actionItemList);
                var postActionItemGroup = $("#ActionItemGroup");
                _this.postActionItemInfo["groupAction"] = [];
                _this.postActionItemInfo.groupAction = _this.actionItemList;
            });
        };
        AdminPostItemAddPageCtrl.prototype.checkBoxValue = function () {
            this.modalInstance.result.then(function (statusSave) {
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
                    }
                }
            });
            this.modalInstance.result.then(function (result) {
                console.log(result);
                if (result.success) {
                    //TODO:: send notification and refresh grid
                    var n = new Notification({
                        message: _this.$filter("i18n_aip")("aip.common.save.successful"),
                        type: "success",
                        flash: true
                    });
                    notifications.addNotification(n);
                    _this.$scope.refreshGrid(true); //use scope to call grid directive's function
                    // this.refreshGrid(true);
                }
                else {
                    //TODO:: send error notification
                }
            }, function (error) {
                console.log(error);
            });
        };
        AdminPostItemAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            /*if(!this.actionItemInfo.name || this.actionItemInfo.name === null || this.actionItemInfo.name === "" ) {
             this.errorMessage.name = "invalid title";
             } else {
             delete this.errorMessage.name;
             }*/
            /* if(!this.postactionItemInfo.folder) {
             this.errorMessage.folder = "invalid folder";
             } else {
             delete this.errorMessage.folder;
             }
             if(!this.postactionItemInfo.description || this.postactionItemInfo.description === null || this.postactionItemInfo.description === "" ) {
             this.errorMessage.description = "invalid description";
             } else {
             delete this.errorMessage.description;
             }
             if(!this.postactionItemInfo.title || this.postactionItemInfo.title === null || this.postactionItemInfo.title === "" || this.postactionItemInfo.title.length > 300) {
             this.errorMessage.title = "invalid title";
             } else {
             delete this.errorMessage.title;
             }
             if(Object.keys(this.errorMessage).length>0) {
             return false;
             } else {
             return true;
             }*/
        };
        AdminPostItemAddPageCtrl.prototype.cancel = function () {
            this.$state.go("admin-action-list");
        };
        AdminPostItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.adminActionService.saveActionItem(this.postactionItemInfo)
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
register("bannerAIP").controller("PostAddModalCtrl", AIP.PostAddModalCtrl);
