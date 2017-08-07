///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/userService.ts"/>
var AIP;
(function (AIP) {
    var ListItemPageCtrl = (function () {
        function ListItemPageCtrl($scope, $state, ItemListViewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT) {
            this.$inject = ["$scope", "$state", "ItemListViewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", , "APP_ROOT"];
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = AIPUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.APP_ROOT = APP_ROOT;
            this.modalInstance;
            this.initialOpenGroup = -1;
            $scope.$watch("vm.detailView", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            });
            notifications.on('add', function (e) {
                setTimeout(function (e) {
                    if (params.saved == true) {
                        //$scope.vm.init();
                        $scope.vm.refreshList();
                    }
                    ;
                }, 500);
            });
            this.init();
        }
        ListItemPageCtrl.prototype.init = function () {
            var _this = this;
            this.informModal(this.$state.params['inform']);
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then(function (userData) {
                var userInfo = userData;
                _this.userName = userData.fullName;
                _this.itemListViewService.getActionItems(userInfo).then(function (actionItems) {
                    angular.forEach(actionItems.groups, function (group) {
                        angular.forEach(group.items, function (item) {
                            item.state = item.state;
                            /*todo: can probably drop the message properties for these status since it's coming from the db*/
                            /*
                            ==="Completed"?
                                "aip.status.complete":
                                "aip.status.pending";
                           */
                        });
                    });
                    _this.actionItems = actionItems;
                    angular.forEach(_this.actionItems.groups, function (item) {
                        item.dscParams = _this.getParams(item.title, userInfo);
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
                    ;
                });
            });
        };
        ListItemPageCtrl.prototype.refreshList = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then(function (userData) {
                var userInfo = userData;
                _this.userName = userData.fullName;
                _this.itemListViewService.getActionItems(userInfo).then(function (actionItems) {
                    angular.forEach(actionItems.groups, function (group) {
                        angular.forEach(group.items, function (item) {
                            item.state = item.state;
                            /*todo: can probably drop the message properties for these status since it's coming from the db*/
                            /*
                             ==="Completed"?
                             "aip.status.complete":
                             "aip.status.pending";
                             */
                        });
                    });
                    _this.actionItems = actionItems;
                    angular.forEach(_this.actionItems.groups, function (item) {
                        item.dscParams = _this.getParams(item.title, userInfo);
                    });
                    // this.resetSelection();
                }).finally(function () {
                    _this.spinnerService.showSpinner(false);
                    console.log(_this.selectedData);
                    setTimeout(function () {
                        $("#item-" + params.groupId + "-" + params.actionItemId).focus()
                            , 100;
                    });
                });
            });
        };
        ListItemPageCtrl.prototype.getInitialSelection = function () {
            var defaultSelection = 0;
            if (this.actionItems.groups.length > 1) {
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
                case "aip.user.list.header.title.registration":
                    param.push(userInfo.fullName || userInfo.firstName);
                    break;
                case "aip.user.list.header.title.graduation":
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
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".listActionItem .welcome").height() -
                30;
            return { height: containerHeight };
        };
        ListItemPageCtrl.prototype.nextItem = function (groupId, itemId) {
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            if (index.item > -1) {
                if ((this.actionItems.groups[index.group].items.length) - 1 > index.item) {
                    index.item++;
                }
                else {
                    index.item = 0;
                }
                var nextItemId = this.actionItems.groups[index.group].items[index.item].id;
                this.selectItem(groupId, nextItemId);
            }
            else {
                var firstItemId = this.actionItems.groups[index.group].items[0].id;
                this.selectItem(groupId, firstItemId);
            }
        };
        ListItemPageCtrl.prototype.selectItem = function (groupId, itemId) {
            var _this = this;
            var defer = this.$q.defer();
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            var selectionType = itemId === null ? "group" : "actionItem";
            var group = this.actionItems.groups.filter(function (item) {
                return item.id == groupId;
            });
            var actionItem = this.actionItems.groups[0].items.filter(function (item) {
                return item.id == itemId;
            });
            this.itemListViewService.getDetailInformation(groupId, selectionType, index.item === null ? null : itemId).then(function (response) {
                _this.selectedData = response;
                _this.selectedData.info.title = actionItem[0].title;
                defer.resolve();
            });
            return defer.promise;
        };
        ListItemPageCtrl.prototype.getIndex = function (groupId, itemId) {
            var index = { group: -1, item: null };
            var selectedGroup = this.actionItems.groups.filter(function (group) {
                return group.id == groupId;
            });
            if (selectedGroup.length !== -1) {
                index.group = this.actionItems.groups.indexOf(selectedGroup[0]);
                var groupItems = this.actionItems.groups[index.group].items;
                var selectedItem = groupItems.filter(function (item) {
                    return item.id == itemId;
                });
                if (groupItems.length !== -1) {
                    index.item = groupItems.indexOf(selectedItem[0]);
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
        ListItemPageCtrl.prototype.informModal = function (show) {
            if (show) {
                this.modalInstance = this.$uibModal.open({
                    templateUrl: this.APP_ROOT + "listItem/itemInform/itemInformTemplate.html",
                    controller: "ItemInformCtrl",
                    controllerAs: "$ctrl",
                    size: "lg",
                    windowClass: "aip-modal"
                });
            }
        };
        ListItemPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return ListItemPageCtrl;
    }());
    AIP.ListItemPageCtrl = ListItemPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("ListItemPageCtrl", AIP.ListItemPageCtrl);
