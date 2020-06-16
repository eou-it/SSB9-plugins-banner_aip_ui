/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/

declare var register: any;

module AIP {
    export class ItemInformCtrl {
       static $inject = ["$scope", "$uibModalInstance", "$window", "APP_ROOT"];
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
            let previousLink=document.referrer;
            let isLoginPage:boolean = previousLink.toLowerCase().indexOf("login")!= -1;
            if (isLoginPage) {
                history.go(-2) ;
            }
            else{
                history.go(-1);
            }
        }

        closeDialog() {
            this.$uibModalInstance.dismiss( 'cancel' );
        }
    }
}

angular.module("bannerCommonAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);
