///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/csrUserService.ts"/>
var CSR;
(function (CSR) {
    var ListItemPageCtrl = (function () {
        function ListItemPageCtrl($scope, $state, ItemListViewService, CSRUserService, SpinnerService, $timeout, $window) {
            this.$inject = ["$scope", "$state", "ItemListViewService", "CSRUserService", "SpinnerService", "$timeout",
                "$window"];
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = CSRUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.initialOpenGroup = -1;
            $scope.$watch("vm.detailView", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            });
            //when resize the window, reapply all changes in the scope - reapply height of container
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
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
                    _this.initialOpenGroup = _this.getInitialSelection();
                    //this.selectedData = {type: SelectionType.Group};
                    if (_this.initialOpenGroup !== -1) {
                        _this.itemListViewService.getDetailInformation(_this.initialOpenGroup, "group", null)
                            .then(function (response) {
                            _this.selectedData = response;
                        });
                    }
                });
            });
        };
        ListItemPageCtrl.prototype.getInitialSelection = function () {
            var defaultSelection = 0;
            if (this.actionItems.length > 1) {
                defaultSelection = -1;
            }
            return defaultSelection;
            //TODO:: when multiple group available, first available group could be opened
        };
        ListItemPageCtrl.prototype.openConfirm = function (groupId, row) {
            //TODO:: get selected row action item detail information
            //TODO:: display action item detail information
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
            //TODO:: parameter for description
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
        ListItemPageCtrl.prototype.showGroupInfo = function (groupId) {
            this.selectItem(groupId, null);
        };
        ListItemPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".listActionItem .welcome").height() -
                35;
            return { height: containerHeight };
        };
        ListItemPageCtrl.prototype.nextItem = function (groupId, itemId) {
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            if (this.actionItems[index.group].items.length - 1 <= index.item) {
                var firstItemId = this.actionItems[groupId].items[0].id;
                this.selectItem(groupId, firstItemId);
            }
            else {
                var nextItemId = this.actionItems[groupId].items[index.item + 1].id;
                this.selectItem(groupId, nextItemId);
            }
        };
        ListItemPageCtrl.prototype.selectItem = function (groupId, itemId) {
            var _this = this;
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            var selectionType = itemId === null ? "group" : "actionItem";
            this.itemListViewService.getDetailInformation(groupId, selectionType, index.item === null ? null : itemId).then(function (response) {
                _this.selectedData = response;
            });
        };
        ListItemPageCtrl.prototype.getIndex = function (groupId, itemId) {
            var index = { group: -1, item: null };
            var selectedGroup = this.actionItems.filter(function (group) {
                return group.groupId === groupId;
            });
            if (selectedGroup.length !== -1) {
                index.group = this.actionItems.indexOf(selectedGroup[0]);
                var selectedItem = this.actionItems[groupId].items.filter(function (item) {
                    return item.id === itemId;
                });
                if (selectedItem.length !== -1) {
                    index.item = this.actionItems[groupId].items.indexOf(selectedItem[0]);
                }
            }
            return index;
        };
        ListItemPageCtrl.prototype.toggleDetail = function (state) {
            var _this = this;
            if (state.open) {
                this.itemListViewService.getDetailInformation(state.groupId, "group", null)
                    .then(function (response) {
                    _this.selectedData = response;
                });
            }
            else {
                this.selectedData = undefined;
            }
        };
        ListItemPageCtrl.prototype.resetSelection = function () {
            this.selectedData = undefined;
        };
        return ListItemPageCtrl;
    })();
    CSR.ListItemPageCtrl = ListItemPageCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);
//# sourceMappingURL=listItemPageCtrl.js.map