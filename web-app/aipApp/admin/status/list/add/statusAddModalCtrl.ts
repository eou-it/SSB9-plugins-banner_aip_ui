//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>

declare var register: any;

module AIP {
    export class StatusAddModalCtrl {
        $inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
        $uibModalInstance,
        adminActionStatusService;
        APP_ROOT;

        constructor($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, ENDPOINT, APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.endPoint = ENDPOINT;   //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.modalInstance;

        }
        statusSave() {
            console.log("save click");
        }
        closeDialog() {
            this.$uibModalInstance.dismiss('cancel');
        }
    }
}

register("bannerAIP").controller("StatusAddModalCtrl", AIP.StatusAddModalCtrl);