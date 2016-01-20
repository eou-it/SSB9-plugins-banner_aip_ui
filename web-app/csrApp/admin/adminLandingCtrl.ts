///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/csrBreadcrumbService.ts"/>

interface IAdminLandingCtrlScrope extends ng.IScope {
    vm:CSR.AdminLandingCtrl;
}

module CSR {
    export class AdminLandingCtrl {
        $inject = ["$scope", "CsrBreadcrumbService"];
        breadcrumbService: CSR.CsrBreadcrumbService;
        constructor($scope:IAdminLandingCtrlScrope, CsrBreadcrumbService:CSR.CsrBreadcrumbService) {
            $scope.vm = this;
            this.breadcrumbService = CsrBreadcrumbService;
            this.init();
        }
        init() {
            this.updateBreadcrumb();
        }
        updateBreadcrumb() {
            var breadItem = {
                "Admin Landing": "/landing"
            };
            this.breadcrumbService.updateBreadcrumb(breadItem);
        }
    }
}

angular.module("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
