declare var register: any;

module AIP {
    export class ItemInformCtrl {
        $inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
        $uibModalInstance;
        ENDPOINT;
        APP_ROOT;

        constructor($scope, $uibModalInstance, ENDPOINT, APP_ROOT) {
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT;
            this.APP_ROOT = APP_ROOT;

        }
        goAhead() {
            console.log("goAhead Clicked");
        }
        goBack() {
                    console.log("goBack Clicked");
                }
        closeDialog() {
            this.$uibModalInstance.dismiss('cancel');
        }
    }
}

register("bannerAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);