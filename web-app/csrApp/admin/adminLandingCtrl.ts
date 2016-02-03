///<reference path="../../typings/tsd.d.ts"/>
declare var register;

interface IAdminLandingCtrlScope extends ng.IScope {
    vm:CSR.AdminLandingCtrl;
}

module CSR {
    export class AdminLandingCtrl {
        $inject = ["$scope", "$state"];
        $state;
        landingItem;
        constructor($scope:IAdminLandingCtrlScope, $state) {
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

register("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
