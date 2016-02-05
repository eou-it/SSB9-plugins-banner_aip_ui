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
                    title: "csr.admin.landing.list.title",
                    icon: "info",
                    state: "admin-list",
                    description: "csr.admin.landing.list.description"
                }
            ];
        };
        return AdminLandingPageCtrl;
    })();
    CSR.AdminLandingPageCtrl = AdminLandingPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminLandingPageCtrl", CSR.AdminLandingPageCtrl);
//# sourceMappingURL=adminLandingPageCtrl.js.map