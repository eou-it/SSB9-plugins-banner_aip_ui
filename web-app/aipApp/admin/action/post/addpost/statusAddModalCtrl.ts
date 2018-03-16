/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

module AIP {
    export class StatusAddModalCtrl {
        $inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
        $uibModalInstance;
        adminActionStatusService;
        APP_ROOT;
        statusModel;
        ENDPOINT;
        errorMessage:any;

        constructor($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT;   //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
        }
        statusSave() {
            this.adminActionStatusService.saveStatus(this.statusModel)
                .then((response) => {
                    if(response.data.success) {
                        console.log( response.data );
                        this.$uibModalInstance.close( response.data );
                    } else {
                        this.saveErrorCallback(response.data.message)
                    }
                }, (error) => {
                    console.log(error);
                    this.$uibModalInstance.dismiss(error);
                });
        }
        closeDialog() {
            this.$uibModalInstance.dismiss('cancel');
        }
        validate() {
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

register("bannerAIP").controller("StatusAddModalCtrl", AIP.StatusAddModalCtrl);
