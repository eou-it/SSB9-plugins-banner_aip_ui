///<reference path="../../../typings/tsd.d.ts"/>


declare var register;

module CSR {
    export class ItemConfirmCtrl {
        $inject = ["$scope", "$stateParams", "$state", "ItemListViewService"];
        itemListViewService;
        actionItems;
        $state;
        constructor($scope, $stateParams, $state, ItemListViewService) {
            $scope.vm = this;
            this.itemListViewService = ItemListViewService;
            this.$state = $state;
            this.actionItems = {
                group: [],
                item: {}
            };
            this.getItem($stateParams.itemId);
        }
        init() {
        }
        getItem(id) {
            angular.forEach(this.itemListViewService.userItems, (item) => {
                var items = item.items.filter((_item) => {
                    return _item.id == id;
                });
                if (items.length!==0) {
                    this.actionItems.group.push(item.info.title);
                    this.actionItems.item = items[0];
                }
            })
        }
        confirmItem(id) {
            this.itemListViewService.confirmItem(id);
            this.$state.go("list");
        }
    }
}

register("bannercsr").controller("ItemConfirmCtrl", CSR.ItemConfirmCtrl);