/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
                    title:"aip.admin.status",
                    icon: "icon-newDocument",
                    click:"admin-status-list",
                    description:"aip.admin.status.description"
                },
                {
                    title:"aip.admin.manage",
                    icon: "icon-folder",
                    click:"admin-manage-list",
                    description:"aip.admin.manage.description"
                },
                {
                    title:"aip.admin.action",
                    icon: "icon-check",
                    click:"admin-action-list",
                    description:"aip.admin.action.description"
                },
                {
                    title:"aip.admin.groups",
                    icon: "icon-cardView",
                    click:"admin-group-list",
                    description:"aip.admin.group.description"
                },
                {
                    title:"aip.admin.action.item.post.item",
                    icon: "icon-postactionitem",
                    click:"admin-post-list",
                    description:"aip.admin.action.item.post.description"
                }
            ];
        }
    }
}

register("bannerAIP").controller("AdminLandingPageCtrl", AIP.AdminLandingPageCtrl);
