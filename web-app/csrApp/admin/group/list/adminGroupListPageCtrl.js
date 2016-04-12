//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
var CSR;
(function (CSR) {
    var AdminGroupListPageCtrl = (function () {
        function AdminGroupListPageCtrl($scope) {
            this.$inject = ["$scope"];
            $scope.vm = this;
        }
        return AdminGroupListPageCtrl;
    })();
    CSR.AdminGroupListPageCtrl = AdminGroupListPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminGroupListPageCtrl", CSR.AdminGroupListPageCtrl);
//# sourceMappingURL=adminGroupListPageCtrl.js.map