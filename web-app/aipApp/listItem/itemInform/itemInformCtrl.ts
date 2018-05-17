/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
declare var register: any;

module AIP {
    export class ItemInformCtrl {
        $inject = ["$scope", "$uibModalInstance", "$window", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
        $uibModalInstance;
        $window;
        ENDPOINT;
        APP_ROOT;

        constructor($scope, $uibModalInstance, $window, ENDPOINT, APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.$window = $window
            this.ENDPOINT = ENDPOINT;
            this.APP_ROOT = APP_ROOT;

        }

        goAhead() {
            this.$uibModalInstance.close();
        }

        goBack() {
            this.$window.history.back()
        }

        closeDialog() {
            this.$uibModalInstance.dismiss( 'cancel' );
        }
    }
}

register("bannerCommonAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);
