///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
var CSR;
(function (CSR) {
    var ListActionItemCtrl = (function () {
        function ListActionItemCtrl($scope, ItemListViewService) {
            this.$inject = ["$scope", "ItemListViewService"];
            $scope.vm = this;
            this.itemListViewService = ItemListViewService;
            this.actionItems = [];
            this.init();
        }
        ListActionItemCtrl.prototype.init = function () {
            var _this = this;
            this.itemListViewService.getActionItems().then(function (response) {
                _this.actionItems = response.data;
            }, function (errorResponse) {
                console.log(errorResponse);
            });
        };
        return ListActionItemCtrl;
    })();
    CSR.ListActionItemCtrl = ListActionItemCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("ListActionItemCtrl", CSR.ListActionItemCtrl);
//# sourceMappingURL=listActionItemCtrl.js.map