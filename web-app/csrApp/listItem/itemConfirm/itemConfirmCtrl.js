///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var ItemConfirmCtrl = (function () {
        function ItemConfirmCtrl($scope, $stateParams, $state, ItemListViewService) {
            this.$inject = ["$scope", "$stateParams", "$state", "ItemListViewService"];
            $scope.vm = this;
            this.itemListViewService = ItemListViewService;
            this.$state = $state;
            this.actionItems = {
                group: [],
                item: {}
            };
            this.getItem($stateParams.itemId);
        }
        ItemConfirmCtrl.prototype.init = function () {
        };
        ItemConfirmCtrl.prototype.getItem = function (id) {
            var _this = this;
            angular.forEach(this.itemListViewService.userItems, function (item) {
                var items = item.items.filter(function (_item) {
                    return _item.id == id;
                });
                if (items.length !== 0) {
                    _this.actionItems.group.push(item.info.title);
                    _this.actionItems.item = items[0];
                }
            });
        };
        ItemConfirmCtrl.prototype.confirmItem = function (id) {
            this.itemListViewService.confirmItem(id);
            this.$state.go("list");
        };
        return ItemConfirmCtrl;
    })();
    CSR.ItemConfirmCtrl = ItemConfirmCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("ItemConfirmCtrl", CSR.ItemConfirmCtrl);
//# sourceMappingURL=itemConfirmCtrl.js.map