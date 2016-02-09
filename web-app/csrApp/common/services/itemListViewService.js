///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var ItemListViewService = (function () {
        function ItemListViewService($http, $q) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.getActionItems().then(function (response) {
                _this.userItems = response.data;
            }, function (errorResponse) {
                console.log(errorResponse);
            });
        }
        ItemListViewService.prototype.getActionItems = function () {
            var request = this.$http({
                method: "POST",
                url: "csrTest/actionItems"
            });
            return request;
        };
        ItemListViewService.prototype.confirmItem = function (id) {
            //TODO: update datbase
            angular.forEach(this.userItems, function (item) {
                angular.forEach(item.items, function (_item) {
                    if (_item.id == id) {
                        _item.state = "csr.user.list.item.state.complete";
                    }
                });
            });
        };
        ItemListViewService.$inject = ["$http", "$q"];
        return ItemListViewService;
    })();
    CSR.ItemListViewService = ItemListViewService;
})(CSR || (CSR = {}));
register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);
//# sourceMappingURL=itemListViewService.js.map