///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/csrUserService.ts"/>
var CSR;
(function (CSR) {
    var ListItemPageCtrl = (function () {
        function ListItemPageCtrl($scope, $state, ItemListViewService, CSRUserService) {
            var _this = this;
            this.$inject = ["$scope", "$state", "ItemListViewService", "CSRUserService"];
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = CSRUserService;
            this.actionItems = this.itemListViewService.userItems;
            //sync with service's userItems
            $scope.$watch(function () {
                return _this.itemListViewService.userItems;
            }, function (newVal) {
                _this.actionItems = newVal;
                angular.forEach(_this.actionItems, function (item) {
                    item.dscParams = _this.getParams(item.info.title);
                });
            });
        }
        ListItemPageCtrl.prototype.openConfirm = function (row) {
            this.$state.go("listConfirm", { itemId: row.id });
        };
        ListItemPageCtrl.prototype.getParams = function (title) {
            var param = [];
            switch (title) {
                case "csr.user.list.header.title.registration":
                    param.push(this.userService.userInfo.preferredName || this.userService.userInfo.firstName);
                    break;
                case "csr.user.list.header.title.graduation":
                    param.push(this.userService.userInfo.graduateCredit);
                    break;
                default:
                    break;
            }
            return param;
        };
        return ListItemPageCtrl;
    })();
    CSR.ListItemPageCtrl = ListItemPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);
//# sourceMappingURL=listItemPageCtrl.js.map