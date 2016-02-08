///<reference path="../../../typings/tsd.d.ts"/>


declare var register;

module CSR {

    interface IItemConfirmCtrl {
        actionItems: {group: string[], item: {}};
        getItems(id: string|number): {group: string[], item: {}};
        confirmItem(id: string|number): void;
    }

    export class ItemConfirmCtrl implements IItemConfirmCtrl{
        $inject = ["$scope", "$stateParams", "$state", "ItemListViewService"];
        itemListViewService;
        actionItems;
        $state;
        constructor($scope, $stateParams, $state, ItemListViewService) {
            $scope.vm = this;
            this.itemListViewService = ItemListViewService;
            this.$state = $state;
            this.init($stateParams.itemId);
        }
        init(itemId) {
            this.actionItems = {
                group: [],
                item: {}
            };
            this.actionItems = this.getItems(itemId);
        }
        getItems(id: string|number) {
            var actionItems = {
                group: [],
                item: {}
            };
            angular.forEach(this.itemListViewService.userItems, (item) => {
                var items = item.items.filter((_item) => {
                    return _item.id == id;
                });
                if (items.length!==0) {
                    actionItems.group.push(item.info.title);
                    actionItems.item = items[0];
                }
            });
            return actionItems;
        }
        confirmItem(id: string|number) {
            this.itemListViewService.confirmItem(id);
            this.$state.go("list");
        }
    }
}

register("bannercsr").controller("ItemConfirmCtrl", CSR.ItemConfirmCtrl);