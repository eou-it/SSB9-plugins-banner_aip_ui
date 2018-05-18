/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var ItemConfirmCtrl = (function () {
        function ItemConfirmCtrl($scope, $stateParams, $state, ItemListViewService) {
            this.$inject = ["$scope", "$stateParams", "$state", "ItemListViewService"];
            $scope.vm = this;
            this.itemListViewService = ItemListViewService;
            this.$state = $state;
            this.init($stateParams.itemId);
        }
        ItemConfirmCtrl.prototype.init = function (itemId) {
            this.actionItems = {
                group: [],
                item: {}
            };
            this.actionItems = this.getItems(itemId);
        };
        ItemConfirmCtrl.prototype.getItems = function (id) {
            var actionItems = {
                group: [],
                item: {}
            };
            angular.forEach(this.itemListViewService.userItems, function (item) {
                var items = item.items.filter(function (_item) {
                    return _item.id == id;
                });
                if (items.length !== 0) {
                    actionItems.group.push(item.info.title);
                    actionItems.item = items[0];
                }
            });
            return actionItems;
        };
        ItemConfirmCtrl.prototype.confirmItem = function (id) {
            this.itemListViewService.confirmItem(id);
            this.$state.go("list");
        };
        return ItemConfirmCtrl;
    }());
    AIP.ItemConfirmCtrl = ItemConfirmCtrl;
})(AIP || (AIP = {}));
register("bannerCommonAIP").controller("ItemConfirmCtrl", AIP.ItemConfirmCtrl);
