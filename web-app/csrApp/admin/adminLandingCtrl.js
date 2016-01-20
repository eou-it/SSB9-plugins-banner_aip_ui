///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/csrBreadcrumbService.ts"/>
var CSR;
(function (CSR) {
    var AdminLandingCtrl = (function () {
        function AdminLandingCtrl($scope, CsrBreadcrumbService) {
            this.$inject = ["$scope", "CsrBreadcrumbService"];
            $scope.vm = this;
            this.breadcrumbService = CsrBreadcrumbService;
            this.init();
        }
        AdminLandingCtrl.prototype.init = function () {
            this.updateBreadcrumb();
        };
        AdminLandingCtrl.prototype.updateBreadcrumb = function () {
            var breadItem = {
                "Admin Landing": "/landing"
            };
            this.breadcrumbService.updateBreadcrumb(breadItem);
        };
        return AdminLandingCtrl;
    })();
    CSR.AdminLandingCtrl = AdminLandingCtrl;
})(CSR || (CSR = {}));
angular.module("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
//# sourceMappingURL=adminLandingCtrl.js.map