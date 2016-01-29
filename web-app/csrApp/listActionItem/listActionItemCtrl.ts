///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>

declare var register;

module CSR {
    export class ListActionItemCtrl {
        $inject = ["$scope", "ItemListViewService"];
        itemListViewService;
        actionItems;
        constructor($scope, ItemListViewService) {
            $scope.vm = this;
            this.itemListViewService = ItemListViewService;
            this.actionItems = [];
            this.init();
        }
        init() {
            this.itemListViewService.getActionItems().then((response) => {
                this.actionItems = response.data;
            }, (errorResponse) => {
                console.log(errorResponse);
            });
        }
    }
}

register("bannercsr").controller("ListActionItemCtrl", CSR.ListActionItemCtrl);