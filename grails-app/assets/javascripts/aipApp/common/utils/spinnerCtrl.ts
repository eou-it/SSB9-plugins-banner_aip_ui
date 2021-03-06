/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module AIP {
    export class SpinnerCtrl {
        static $inject = ["$scope", "SpinnerService", "$rootScope"];
        spinnerService;
        showing: boolean;
        vm;
        constructor($scope, SpinnerService, $rootScope) {
            $scope.vm = this;
            this.spinnerService = SpinnerService;
            this.showing = this.spinnerService.showing;
            $rootScope.$watch( () => {
                return this.spinnerService.showing;
            }, (newVal) => {
                this.showing = newVal;
            }, true);
        }
    }
}
angular.module("bannerCommonAIP").controller("SpinnerCtrl", AIP.SpinnerCtrl);