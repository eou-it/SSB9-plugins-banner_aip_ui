///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
var CSR;
(function (CSR) {
    var ListItemPageCtrl = (function () {
        function ListItemPageCtrl($scope, $state, ItemListViewService) {
            var _this = this;
            this.$inject = ["$scope", "$state", "ItemListViewService"];
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.actionItems = [];
            $scope.$watch(function () {
                return _this.itemListViewService.userItems;
            }, function (newVal) {
                _this.actionItems = newVal;
            });
            this.init();
        }
        ListItemPageCtrl.prototype.init = function () {
            this.actionItems = this.itemListViewService.userItems;
        };
        ListItemPageCtrl.prototype.openConfirm = function (row) {
            this.$state.go("listConfirm", { itemId: row.id });
        };
        return ListItemPageCtrl;
    })();
    CSR.ListItemPageCtrl = ListItemPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);
//# sourceMappingURL=listItemPageCtrl.js.map