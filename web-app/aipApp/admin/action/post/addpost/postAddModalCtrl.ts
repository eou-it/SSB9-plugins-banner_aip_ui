//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

module AIP {
    export class PostAddModalCtrl {
        $inject = ["$scope", "$uibModalInstance", "ENDPOINT", "AdminActionStatusService","actionItemModal", "APP_ROOT"];
        $uibModalInstance;
        $scope;
        adminActionStatusService;
        actionItemModal;
        APP_ROOT;
        statusModel;
        ENDPOINT;
        errorMessage:any;

        constructor($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService,actionItemModal, APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT;   //ENDPOINT.admin.actionList
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

        statusSave() {
            var checkedCavllue = this.actionItemModal.filter((item) => {
                console.log();
                return item.check===true;

            });
            this.$uibModalInstance.close(checkedCavllue);
        }

        closeDialog() {
            this.$uibModalInstance.dismiss('cancel');
        }
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
        saveErrorCallback(message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }
    }
}

register("bannerAIP").controller("PostAddModalCtrl", AIP.PostAddModalCtrl);
