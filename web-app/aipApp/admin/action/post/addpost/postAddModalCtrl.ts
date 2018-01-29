/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
            this.actionItemModal.map((item)=> {
                if (item.check === undefined) {
                    item.check = true;
                }
            });
            this.actionFolderGroupModal=actionFolderGroupModal;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
            console.log(this.actionItemModal);
            console.log(this.actionItemModal.check)
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

        isCheckAll() {
            var checked = this.actionItemModal.filter((item) => {
                return item.check && item.check === true;
            });
            if (checked.length === this.actionItemModal.length) {
                this.checkAll = true;
                return true;
            } else {
                this.checkAll = false;
                return false;
            }
        }

        changedAllValue(){
            this.actionItemModal.map((item) => {item.check=this.checkAll;})
        }

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
