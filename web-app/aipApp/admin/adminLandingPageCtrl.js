var AIP;
(function (AIP) {
    var AdminLandingPageCtrl = /** @class */ (function () {
        function AdminLandingPageCtrl($scope, $state) {
            this.$inject = ["$scope", "$state"];
            $scope.vm = this;
            this.$state = $state;
            this.init();
        }
        AdminLandingPageCtrl.prototype.init = function () {
            this.landingItem = [
                {
                    title: "aip.admin.status",
                    icon: "icon-newDocument",
                    click: "admin-status-list",
                    description: "aip.admin.status.description"
                },
                {
                    title: "aip.admin.manage",
                    icon: "icon-folder",
                    click: "admin-manage-list",
                    description: "aip.admin.manage.description"
                },
                {
                    title: "aip.admin.action",
                    icon: "icon-check",
                    click: "admin-action-list",
                    description: "aip.admin.action.description"
                },
                {
                    title: "aip.admin.groups",
                    icon: "icon-cardView",
                    click: "admin-group-list",
                    description: "aip.admin.group.description"
                },
                {
                    title: "aip.admin.action.item.post.item",
                    icon: "icon-postactionitem",
                    click: "admin-post-list",
                    description: "aip.admin.action.item.post.description"
                }
            ];
        };
        return AdminLandingPageCtrl;
    }());
    AIP.AdminLandingPageCtrl = AdminLandingPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminLandingPageCtrl", AIP.AdminLandingPageCtrl);
