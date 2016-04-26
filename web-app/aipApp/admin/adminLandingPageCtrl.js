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
                    title: "aip.admin.group",
                    icon: "info",
                    click: "admin-group-list",
                    description: "aip.admin.group.description"
                },
                {
                    title: "Title",
                    icon: "info",
                    click: "admin-list",
                    description: "Placeholder for item (to check layout)"
                }
            ];
        };
        return AdminLandingPageCtrl;
    })();
    AIP.AdminLandingPageCtrl = AdminLandingPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminLandingPageCtrl", AIP.AdminLandingPageCtrl);
//# sourceMappingURL=adminLandingPageCtrl.js.map