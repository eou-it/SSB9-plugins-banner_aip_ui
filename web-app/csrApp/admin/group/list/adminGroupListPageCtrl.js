//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
var CSR;
(function (CSR) {
    var AdminGroupListPageCtrl = (function () {
        function AdminGroupListPageCtrl($scope, AdminGroupService) {
            this.$inject = ["$scope", "AdminGroupService"];
            $scope.vm = this;
            this.adminGroupService = AdminGroupService;
            this.init();
            $scope.$watch("vm.gridData", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            });
        }
        AdminGroupListPageCtrl.prototype.init = function () {
            var _this = this;
            this.adminGroupService.getGroupList().then(function (response) {
                _this.gridData = response;
            }, function (err) {
                console.log(err);
            });
        };
        return AdminGroupListPageCtrl;
    })();
    CSR.AdminGroupListPageCtrl = AdminGroupListPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminGroupListPageCtrl", CSR.AdminGroupListPageCtrl);
//# sourceMappingURL=adminGroupListPageCtrl.js.map