///<reference path="../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var AdminLandingCtrl = (function () {
        function AdminLandingCtrl($scope, $state) {
            this.$inject = ["$scope", "$state"];
            $scope.vm = this;
            this.$state = $state;
            this.init();
        }
        AdminLandingCtrl.prototype.init = function () {
            this.landingItem = [
                {
                    title: "csr.admin.landing.list.title",
                    icon: "info",
                    state: "admin-list",
                    description: "csr.admin.landing.list.description"
                }
            ];
        };
        return AdminLandingCtrl;
    })();
    CSR.AdminLandingCtrl = AdminLandingCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
//# sourceMappingURL=adminLandingCtrl.js.map