///<reference path="../../typings/tsd.d.ts"/>
declare var register;

interface IAdminLandingPageCtrlScope extends ng.IScope {
    vm:AIP.AdminLandingPageCtrl;
}

module AIP {
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
                    title:"aip.admin.group",
                    icon: "info",
                    click:"admin-group-list",
                    description:"aip.admin.group.description"
                },
                {
                    title:"Title",
                    icon: "info",
                    click:"admin-list",
                    description:"Placeholder for item (to check layout)"
                }
            ];
        }
    }
}

register("bannerAIP").controller("AdminLandingPageCtrl", AIP.AdminLandingPageCtrl);
