///<reference path="../../typings/tsd.d.ts"/>
declare var register;

interface IAdminLandingPageCtrlScope extends ng.IScope {
    vm:CSR.AdminLandingPageCtrl;
}

module CSR {
    export class AdminLandingPageCtrl {
        $inject = ["$scope", "$state"];
        $state;
        landingItem;
        constructor($scope:IAdminLandingPageCtrlScope, $state) {
            $scope.vm = this;
            this.$state = $state;
            this.init();
        }
        init() {
            this.landingItem = [
                {
                    title:"csr.admin.landing.list.title",
                    icon: "info",
                    state:"admin-list",
                    description:"csr.admin.landing.list.description"
                }
            ];
        }
    }
}

register("bannercsr").controller("AdminLandingPageCtrl", CSR.AdminLandingPageCtrl);
