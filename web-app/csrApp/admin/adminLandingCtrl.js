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
                    title: "Confirmation Maintenance",
                    icon: "info",
                    state: "admin-list",
                    description: "Create and maintain action item to require confirmations and submissions.\n" +
                        "Create Action Item overview (Name, Description, Folder, Status, From and To Dates)\n" +
                        "Define Action Item Web Pages, Fields, Text, Links, Buttons, Navigation (Page Builder)"
                }
            ];
        };
        return AdminLandingCtrl;
    })();
    CSR.AdminLandingCtrl = AdminLandingCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
//# sourceMappingURL=adminLandingCtrl.js.map