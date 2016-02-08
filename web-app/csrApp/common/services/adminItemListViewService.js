///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var AdminItemListViewService = (function () {
        function AdminItemListViewService($http, $q) {
            this.$http = $http;
            this.$q = $q;
            this.init();
        }
        AdminItemListViewService.prototype.init = function () {
            var _this = this;
            this.getGridData().then(function (response) {
                _this.gridData = {
                    header: response.data.header,
                    result: response.data.result
                };
            }, function (errorResponse) {
                console.log(errorResponse);
                //TODO: handling error
            });
            this.getCodeTypes().then(function (response) {
                _this.codeTypes = response.data;
            }, function (errorResponse) {
                console.log(errorResponse);
                //TODO: handling error
            });
        };
        AdminItemListViewService.prototype.getCodeTypes = function () {
            var request = this.$http({
                method: "POST",
                url: "csrTest/codeTypes"
            });
            return request;
        };
        AdminItemListViewService.prototype.getGridData = function () {
            var request = this.$http({
                method: "POST",
                url: "csrTest/adminActionItems"
            });
            return request;
        };
        AdminItemListViewService.prototype.getLastItemId = function () {
            var idArray = this.gridData.result.map(function (item) { return item.id; });
            return Math.max.apply(Math, idArray);
        };
        AdminItemListViewService.prototype.removeSelectedItem = function (selectedItems) {
            var _this = this;
            angular.forEach(this.gridData.result, function (item, idx) {
                var exist = selectedItems.filter(function (_item) { return item.id === _item.id; });
                if (exist.length === 0) {
                    _this.gridData.result.splice(idx, 1);
                }
            });
            return this.gridData.result;
        };
        AdminItemListViewService.prototype.addNewItems = function (items) {
            this.gridData.result = items.concat(this.gridData.result);
        };
        AdminItemListViewService.$inject = ["$http", "$q"];
        return AdminItemListViewService;
    })();
    CSR.AdminItemListViewService = AdminItemListViewService;
})(CSR || (CSR = {}));
register("bannercsr").service("AdminItemListViewService", CSR.AdminItemListViewService);
//# sourceMappingURL=adminItemListViewService.js.map