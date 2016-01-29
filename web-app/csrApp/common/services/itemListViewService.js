///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var ItemListViewService = (function () {
        function ItemListViewService($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        ItemListViewService.prototype.getActionItems = function () {
            var request = this.$http({
                method: "POST",
                url: "csr/actionItems"
            });
            return request;
        };
        ItemListViewService.$inject = ["$http", "$q"];
        return ItemListViewService;
    })();
    CSR.ItemListViewService = ItemListViewService;
})(CSR || (CSR = {}));
register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);
//# sourceMappingURL=itemListViewService.js.map