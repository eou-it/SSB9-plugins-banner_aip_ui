//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

module AIP {
    export class PostAddModalCtrl {
        $inject = ["$scope", "$uibModalInstance", "ENDPOINT", "AdminActionStatusService","actionItemModal", "actionGroupModal","actionFolderGroupModal","APP_ROOT"];
        $uibModalInstance;
        $scope;
        adminActionStatusService;
        actionItemModal;
        actionGroupModal;
        actionFolderGroupModal
        APP_ROOT;
        statusModel;
        ENDPOINT;
        checkAll:boolean;
        checkedCavllue;
        errorMessage:any;

        constructor($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService,actionItemModal, actionGroupModal,actionFolderGroupModal,APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT;   //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.$scope = $scope;
            this.checkAll=true;
            this.actionItemModal = actionItemModal;
            this.actionGroupModal= actionGroupModal;
            this.actionFolderGroupModal=actionFolderGroupModal;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
            console.log(this.actionItemModal);
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
        statusSave() {
            this.checkedCavllue={};
            if (this.checkAll===true){
                this.actionItemModal.map((item)=> {
                    return item["check"]=true;
                })
            }

            var checkedCavllue = this.actionItemModal.filter((item) => {

                return item.check===true;

            });
            this.$uibModalInstance.close(checkedCavllue);
        }

        closeDialog() {

            this.$uibModalInstance.dismiss('cancel');

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
