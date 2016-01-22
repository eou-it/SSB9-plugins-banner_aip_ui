///<reference path="../../typings/tsd.d.ts"/>

interface IAdminLandingCtrlScrope extends ng.IScope {
    vm:CSR.AdminLandingCtrl;
}

module CSR {
    export class AdminLandingCtrl {
        $inject = ["$scope"];
        landingItem;
        constructor($scope:IAdminLandingCtrlScrope) {
            $scope.vm = this;
            this.init();
        }
        init() {
            this.landingItem = [
                {
                    title:"List",
                    status:"admin-list",
                    description:"Test"
                }
            ];
        }
    }
}

angular.module("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
