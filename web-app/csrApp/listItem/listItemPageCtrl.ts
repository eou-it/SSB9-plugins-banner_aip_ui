///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>

declare var register;

module CSR {
    export class ListItemPageCtrl {
        $inject = ["$scope", "$state", "ItemListViewService"];
        itemListViewService;
        actionItems;
        $state;
        constructor($scope, $state, ItemListViewService) {
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.actionItems = [];
            //sync with service's userItems
            $scope.$watch (  ( )=> {
                return this.itemListViewService.userItems;}, (newVal) => {
                this.actionItems = newVal;
            });
            this.init();
        }
        init() {
            this.actionItems = this.itemListViewService.userItems;
        }
        openConfirm(row) {
            this.$state.go("listConfirm", {itemId:row.id});
        }
    }
}

register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);