///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/csrUserService.ts"/>
var CSR;
(function (CSR) {
    var ListItemPageCtrl = (function () {
        function ListItemPageCtrl($scope, $state, ItemListViewService, CSRUserService, SpinnerService, $timeout) {
            this.$inject = ["$scope", "$state", "ItemListViewService", "CSRUserService", "SpinnerService", "$timeout"];
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = CSRUserService;
            this.spinnerService = SpinnerService;
            this.detailView = null;
            this.$timeout = $timeout;
            this.init();
        }
        ListItemPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then(function (userData) {
                var userInfo = userData;
                _this.userName = userData.fullName;
                _this.itemListViewService.getActionItems(userInfo).then(function (actionItems) {
                    _this.actionItems = actionItems;
                    angular.forEach(_this.actionItems, function (item) {
                        item.dscParams = _this.getParams(item.info.title, userInfo);
                    });
                }).finally(function () {
                    _this.spinnerService.showSpinner(false);
                });
            });
        };
        ListItemPageCtrl.prototype.openConfirm = function (row) {
            //var elem = angular.element(document.querySelector('[ng-app]'));
            //var $rootScope = elem.injector().get("$rootScope");
            //$rootScope.$state.go("listConfirm", {itemId:row.id});
            this.detailView = row.id;
        };
        ListItemPageCtrl.prototype.styleFunction = function (key) {
            var returnClass = "";
            switch (key) {
                case "title":
                    returnClass = "col-xs-8 col-sm-8";
                    break;
                case "state":
                    returnClass = "col-xs-4 col-sm-4";
                    break;
                case "description":
                    returnClass = "col-xs-12 clearfix col-sm-12 ";
                    break;
            }
            return returnClass + " cell " + key;
        };
        ListItemPageCtrl.prototype.getParams = function (title, userInfo) {
            var param = [];
            switch (title) {
                case "csr.user.list.header.title.registration":
                    param.push(userInfo.fullName || userInfo.firstName);
                    break;
                case "csr.user.list.header.title.graduation":
                    param.push(userInfo.graduateCredit || "121");
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