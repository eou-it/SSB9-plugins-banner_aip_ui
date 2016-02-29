///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {
    export class SpinnerCtrl {
        static $inject = ["$scope", "SpinnerService", "$rootScope"];
        spinnerService;
        showing: boolean;
        vm;
        constructor($scope, SpinnerService, $rootScope) {
            $scope.vm = this;
            this.spinnerService = SpinnerService;
            this.showing = SpinnerService.showing;
            $rootScope.$watch( () => {
                return this.spinnerService.showing;
            }, (newVal) => {
                this.showing = newVal;
            }, true);
        }
    }
}

register("bannercsr").controller("SpinnerCtrl", CSR.SpinnerCtrl);