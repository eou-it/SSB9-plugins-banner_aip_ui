///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
var CSR;
(function (CSR) {
    var AdminGroupAddPageCtrl = (function () {
        function AdminGroupAddPageCtrl($scope, AdminGroupService, $q) {
            this.$inject = ["$scope", "AdminGroupService", "$q"];
            $scope.vm = this;
            this.$q = $q;
            this.adminGroupService = AdminGroupService;
            $scope.$watch("[vm.status, vm.folders]", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            }, true);
            this.init();
        }
        AdminGroupAddPageCtrl.prototype.init = function () {
            var _this = this;
            //TODO::trun on the spinner
            var promises = [];
            this.groupInfo = {};
            promises.push(this.adminGroupService.getStatus().then(function (status) {
                _this.status = status;
            }));
            promises.push(this.adminGroupService.getFolder().then(function (folders) {
                _this.folders = folders;
            }));
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.groupInfo.status = _this.status[0];
                _this.groupInfo.folder = _this.folders[0];
            });
        };
        AdminGroupAddPageCtrl.prototype.save = function () {
        };
        AdminGroupAddPageCtrl.prototype.cancel = function () {
        };
        AdminGroupAddPageCtrl.prototype.selectStatus = function (item) {
            this.groupInfo.status = item;
        };
        AdminGroupAddPageCtrl.prototype.selectFolder = function (item) {
            this.groupInfo.folder = item;
        };
        return AdminGroupAddPageCtrl;
    })();
    CSR.AdminGroupAddPageCtrl = AdminGroupAddPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminGroupAddPageCtrl", CSR.AdminGroupAddPageCtrl);
//# sourceMappingURL=adminGroupAddPageCtrl.js.map