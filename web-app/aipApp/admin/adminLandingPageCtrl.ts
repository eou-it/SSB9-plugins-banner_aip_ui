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
                    title:"aip.admin.action",
                    icon: "icon-check-SO",
                    click:"admin-list",
                    description:"aip.admin.action.description"
                },
                {
                    title:"aip.admin.group",
                    icon: "icon-cardView-SO",
                    click:"admin-group-list",
                    description:"aip.admin.group.description"
                }
            ];
        }
    }
}

register("bannerAIP").controller("AdminLandingPageCtrl", AIP.AdminLandingPageCtrl);
