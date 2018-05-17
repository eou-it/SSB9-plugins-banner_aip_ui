/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var PostAddModalCtrl = /** @class */ (function () {
        function PostAddModalCtrl($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, EditMode, PostId, ChangeFlag, selectedActionItemList, actionItemModal, actionGroupModal, actionFolderGroupModal, APP_ROOT) {
            var _this = this;
            this.$inject = ["$scope", "$uibModalInstance", "ENDPOINT", "AdminActionStatusService", "EditMode", "PostId", "ChangeFlag", "selectedActionItemList", "actionItemModal", "actionGroupModal", "actionFolderGroupModal", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT; //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.$scope = $scope;
            this.checkAll = true;
            this.EditMode = EditMode;
            this.PostId = PostId;
            this.actionItemModal = actionItemModal;
            this.actionGroupModal = actionGroupModal;
            this.selectedActionItemList = selectedActionItemList;
            this.ChangeFlag = ChangeFlag;
            this.actionItemModal.map(function (item) {
                if (_this.EditMode === false || _this.ChangeFlag === true) {
                    if (item.check === undefined) {
                        item.check = true;
                    }
                }
                else {
                    if (_this.actionItemModal.length === _this.selectedActionItemList.length) {
                        item.check = true;
                    }
                    else {
                        for (var i = 0; i < _this.actionItemModal.length; i++) {
                            for (var j = 0; j < _this.selectedActionItemList.length; j++) {
                                if (_this.actionItemModal[i].actionItemId === _this.selectedActionItemList[j].actionItemId) {
                                    actionItemModal[i].check = true;
                                }
                            }
                        }
                    }
                }
            });
            this.actionFolderGroupModal = actionFolderGroupModal;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
        }
        PostAddModalCtrl.prototype.isCheckAll = function () {
            var checked = this.actionItemModal.filter(function (item) {
                return item.check && item.check === true;
            });
            if (checked.length === this.actionItemModal.length) {
                this.checkAll = true;
                return true;
            }
            else {
                this.checkAll = false;
                return false;
            }
        };
        PostAddModalCtrl.prototype.changedAllValue = function () {
            var _this = this;
            this.actionItemModal.map(function (item) { item.check = _this.checkAll; });
        };
        PostAddModalCtrl.prototype.statusSave = function () {
            this.checkedCavllue = {};
            if (this.checkAll === true) {
                this.actionItemModal.map(function (item) {
                    return item["check"] = true;
                });
            }
            var checkedCavllue = this.actionItemModal.filter(function (item) {
                return item.check === true;
            });
            this.$uibModalInstance.close(checkedCavllue);
        };
        PostAddModalCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        PostAddModalCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return PostAddModalCtrl;
    }());
    AIP.PostAddModalCtrl = PostAddModalCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("PostAddModalCtrl", AIP.PostAddModalCtrl);
