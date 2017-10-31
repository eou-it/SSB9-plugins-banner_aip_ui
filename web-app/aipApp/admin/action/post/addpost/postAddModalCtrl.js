//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var PostAddModalCtrl = (function () {
        function PostAddModalCtrl($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, actionItemModal, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "ENDPOINT", "AdminActionStatusService", "actionItemModal", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT; //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.$scope = $scope;
            this.actionItemModal = actionItemModal;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
            console.log(this.actionItemModal);
        }
        PostAddModalCtrl.prototype.statusSave = function () {
            this.checkedCavllue = {};
            var checkedCavllue = this.actionItemModal.filter(function (item) {
                console.log();
                return item.check === true;
            });
            this.$uibModalInstance.close(checkedCavllue);
        };
        PostAddModalCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        /* validate() {
             if (this.statusModel.title.length===0 || this.statusModel.title.length > 30) {
                 delete this.errorMessage.title;
             } else {
                 delete this.errorMessage.title;
             }
 
             if(Object.keys(this.errorMessage).length>0) {
                 return false;
             } else {
                 return true;
             }
         }*/
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
