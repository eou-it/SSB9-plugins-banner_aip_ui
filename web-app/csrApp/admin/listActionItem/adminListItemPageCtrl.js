///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/adminItemListViewService.ts"/>
var CSR;
(function (CSR) {
    var AdminListItemPageCtrl = (function () {
        function AdminListItemPageCtrl($scope, AdminItemListViewService) {
            var _this = this;
            this.adminItemListViewService = AdminItemListViewService;
            this.init();
            $scope.vm = this;
            $scope.$watch(function () {
                return _this.adminItemListViewService.gridData;
            }, function (newVal) {
                _this.gridData = newVal;
            });
            $scope.$watch(function () {
                return _this.adminItemListViewService.codeTypes;
            }, function (newVal) {
                _this.codeTypes = newVal;
            });
        }
        AdminListItemPageCtrl.prototype.init = function () {
            this.listEndPoint = "/StudentSSB/ssb/csr/adminActionItems";
            this.codeTypes = this.adminItemListViewService.codeTypes;
            this.gridData = this.adminItemListViewService.gridData;
            this.disableDelete = true;
            this.disableUpdate = true;
        };
        AdminListItemPageCtrl.prototype.chkboxCallback = function (filteredItems) {
            var selected = filteredItems.filter(function (item) { return item.selected; });
            if (selected.length > 0) {
                this.disableDelete = false;
            }
            else {
                this.disableDelete = true;
            }
            return selected;
        };
        AdminListItemPageCtrl.prototype.selectAll = function (filteredItems, chkAll) {
            angular.forEach(filteredItems, function (item) {
                item.selected = chkAll;
            });
        };
        AdminListItemPageCtrl.prototype.removeItemCallback = function (filteredItems) {
            var selected = this.chkboxCallback(filteredItems);
            this.gridData.result = this.adminItemListViewService.removeSelectedItem(selected);
            this.chkboxCallback(this.gridData.result);
            this.disableUpdate = false;
        };
        AdminListItemPageCtrl.prototype.addNewItem = function (evt) {
        };
        AdminListItemPageCtrl.prototype.updateItems = function () {
            this.disableUpdate = true;
        };
        AdminListItemPageCtrl.$inject = ["$scope", "AdminItemListViewService"];
        return AdminListItemPageCtrl;
    })();
    CSR.AdminListItemPageCtrl = AdminListItemPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("AdminListItemPageCtrl", CSR.AdminListItemPageCtrl);
//# sourceMappingURL=adminListItemPageCtrl.js.map