///<reference path="../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
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
                    title: "csr.admin.group",
                    icon: "info",
                    click: "admin-group-list",
                    description: "csr.admin.group.description"
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
    CSR.AdminLandingPageCtrl = AdminLandingPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminLandingPageCtrl", CSR.AdminLandingPageCtrl);
//# sourceMappingURL=adminLandingPageCtrl.js.map