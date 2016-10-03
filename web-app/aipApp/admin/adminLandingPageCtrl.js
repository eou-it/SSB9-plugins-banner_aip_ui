///<reference path="../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminLandingPageCtrl = (function () {
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
                    title: "aip.admin.action",
                    icon: "icon-check-SO",
                    click: "admin-action-list",
                    description: "aip.admin.action.description"
                },
                {
                    title: "aip.admin.group",
                    icon: "icon-cardView-SO",
                    click: "admin-group-list",
                    description: "aip.admin.group.description"
                }
            ];
        };
        return AdminLandingPageCtrl;
    }());
    AIP.AdminLandingPageCtrl = AdminLandingPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminLandingPageCtrl", AIP.AdminLandingPageCtrl);
//# sourceMappingURL=adminLandingPageCtrl.js.map