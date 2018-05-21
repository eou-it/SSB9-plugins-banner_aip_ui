/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
declare var register: any;

module AIP {
    export class ItemInformCtrl {
        $inject = ["$scope", "$uibModalInstance", "$window", "APP_ROOT"];
        $uibModalInstance;
        $window;
        APP_ROOT;

        constructor($scope, $uibModalInstance, $window, APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.$window = $window
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
