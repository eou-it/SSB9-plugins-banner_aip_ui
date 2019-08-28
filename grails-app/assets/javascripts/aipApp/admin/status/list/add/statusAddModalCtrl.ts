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
        $inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_FOLDER_PATH"];
        $uibModalInstance;
        adminActionStatusService;
        APP_FOLDER_PATH;
        statusModel;
        ENDPOINT;
        errorMessage:any;

        constructor($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, APP_FOLDER_PATH) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT;   //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_FOLDER_PATH = APP_FOLDER_PATH;
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
                        //this.$uibModalInstance.dismiss();
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
                console.log(delete this.errorMessage.title)
            }
            return Object.keys(this.errorMessage).length <=0
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

angular.module("bannerAIP").controller("StatusAddModalCtrl", AIP.StatusAddModalCtrl);
