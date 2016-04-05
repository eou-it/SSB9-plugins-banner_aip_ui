///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/admin/adminItemListViewService.ts"/>
var CSR;
(function (CSR) {
    var AdminListItemPageCtrl = (function () {
        function AdminListItemPageCtrl($scope, AdminItemListViewService, ENDPOINT) {
            var _this = this;
            this.adminItemListViewService = AdminItemListViewService;
            this.ENDPOINT = ENDPOINT;
            this.init();
            $scope.vm = this;
            $scope.$watch(function () {
                return _this.adminItemListViewService.gridData;
            }, function (newVal) {
                _this.gridData = newVal;
            });
        }
        AdminListItemPageCtrl.prototype.init = function () {
            this.gridData = this.adminItemListViewService.gridData;
        };
        AdminListItemPageCtrl.prototype.selectAll = function (filteredItems, chkAll) {
            angular.forEach(filteredItems, function (item) {
                item.selected = chkAll;
            });
        };
        AdminListItemPageCtrl.prototype.removeItemCallback = function (filteredItems) {
        };
        AdminListItemPageCtrl.prototype.addNewItem = function (evt) {
        };
        AdminListItemPageCtrl.prototype.updateItems = function () {
        };
        AdminListItemPageCtrl.$inject = ["$scope", "AdminItemListViewService", "ENDPOINT"];
        return AdminListItemPageCtrl;
    })();
    CSR.AdminListItemPageCtrl = AdminListItemPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminListItemPageCtrl", CSR.AdminListItemPageCtrl);
//# sourceMappingURL=adminListItemPageCtrl.js.map