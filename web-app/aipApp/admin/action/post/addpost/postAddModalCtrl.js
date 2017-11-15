//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var PostAddModalCtrl = (function () {
        function PostAddModalCtrl($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, actionItemModal, actionGroupModal, actionFolderGroupModal, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "ENDPOINT", "AdminActionStatusService", "actionItemModal", "actionGroupModal", "actionFolderGroupModal", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT; //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.$scope = $scope;
            this.checkAll = true;
            this.actionItemModal = actionItemModal;
            this.actionGroupModal = actionGroupModal;
            this.actionItemModal.map(function (item) {
                if (item.check === undefined) {
                    item.check = true;
                }
            });
            this.actionFolderGroupModal = actionFolderGroupModal;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
            console.log(this.actionItemModal);
            console.log(this.actionItemModal.check);
        }
        /*checkAll() {
             if (this.checkAll === true) {
                 angular.forEach(this.actionItemModal, (item) => {
            item.check = true;
                });
                } else {
             angular.forEach(this.actionItemModal, (item) => {
            item.check = false;
                 });
             }
            }*/
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
