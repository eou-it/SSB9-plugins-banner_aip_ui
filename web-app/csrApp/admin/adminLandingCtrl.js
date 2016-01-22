///<reference path="../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var AdminLandingCtrl = (function () {
        function AdminLandingCtrl($scope) {
            this.$inject = ["$scope"];
            $scope.vm = this;
            this.init();
        }
        AdminLandingCtrl.prototype.init = function () {
            this.landingItem = [
                {
                    title: "List",
                    status: "admin-list",
                    description: "Test"
                }
            ];
        };
        return AdminLandingCtrl;
    })();
    CSR.AdminLandingCtrl = AdminLandingCtrl;
})(CSR || (CSR = {}));
angular.module("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
//# sourceMappingURL=adminLandingCtrl.js.map