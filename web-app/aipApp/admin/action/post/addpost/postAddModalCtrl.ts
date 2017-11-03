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
        checkedCavllue;
        unCheckedCavllue;
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
                console.log(item);
                return item.check===true;

            });
            this.$uibModalInstance.close(checkedCavllue);
        }

        closeDialog() {
            var unCheckedCavllue = this.actionItemModal.filter((item) => {
                console.log(item.check);
                return item.check===false;
            });
            this.$uibModalInstance.dismiss(unCheckedCavllue);

        }

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
