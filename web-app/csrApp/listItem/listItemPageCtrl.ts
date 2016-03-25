///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/csrUserService.ts"/>

declare var register;

module CSR {


    interface IListItemPageCtrl {
        itemListViewService: CSR.ItemListViewService;
        userService: CSR.UserService;
        actionItems: IUserItem[];
        selectedData: ISelectedData;
        initialOpenGroup: number;
        getInitialSelection(): number;
        openConfirm(groupId:string|number, row):void;
        getParams(title:string, userInfo:CSR.IUserInfo):string[];
        styleFunction(key:string):string;
        showGroupInfo(idx:number);
        getHeight(): {height:number};
        nextItem(groupId:string|number, itemId:number): void;
        selectItem(groupId: number|string, itemId:number|string): void;
        toggleDetail(state:{idx:number|string, open:boolean}):void;
        resetSelection():void;
    }

    export class ListItemPageCtrl implements IListItemPageCtrl{
        $inject = ["$scope", "$state", "ItemListViewService", "CSRUserService", "SpinnerService", "$timeout",
            "$window"];
        itemListViewService:CSR.ItemListViewService;
        userService:CSR.UserService;
        actionItems:IUserItem[];
        initialOpenGroup;
        spinnerService;
        userName;
        selectedData: ISelectedData;
        $timeout;
        $state;

        constructor($scope, $state, ItemListViewService, CSRUserService, SpinnerService, $timeout, $window) {
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = CSRUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.initialOpenGroup = -1;
            $scope.$watch(
                "vm.detailView", function(newVal, oldVal) {
                    if(!$scope.$$phase) {
                        $scope.apply();
                    }
                }
            );

            //when resize the window, reapply all changes in the scope - reapply height of container
            angular.element($window).bind('resize', function() {
                //$scope.onResize();
                $scope.$apply();
            });
            this.init();
        }
        init() {
            this.spinnerService.showSpinner(true);

            this.userService.getUserInfo().then((userData) => {
                var userInfo = userData;
                this.userName = userData.fullName;
                this.itemListViewService.getActionItems(userInfo).then((actionItems) => {
                    this.actionItems = actionItems;
                    angular.forEach(this.actionItems, (item) => {
                        item.dscParams = this.getParams(item.info.title, userInfo);
                    });
                }).finally(() => {
                    this.spinnerService.showSpinner(false);
                    this.initialOpenGroup = this.getInitialSelection();
                    //this.selectedData = {type: SelectionType.Group};
                    if(this.initialOpenGroup !==-1) {
                        this.itemListViewService.getDetailInformation(this.initialOpenGroup, "group", null)
                            .then((response:ISelectedData) => {
                                this.selectedData = response;
                            });
                    }
                });
            });
        }
        getInitialSelection() {
            var defaultSelection= 0;
            if(this.actionItems.length > 1) {
                defaultSelection = -1;
            }
            return defaultSelection;
            //TODO:: when multiple group available, first available group could be opened
        }
        openConfirm(groupId, row) {

            //TODO:: get selected row action item detail information
            //TODO:: display action item detail information
        }
        styleFunction(key) {
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
        }
        getParams(title, userInfo) {
            //TODO:: parameter for description
            var param = [];
            switch (title) {
                case "csr.user.list.header.title.registration":
                    param.push(userInfo.fullName||userInfo.firstName);
                    break;
                case "csr.user.list.header.title.graduation":
                    param.push(userInfo.graduateCredit||"121");
                    break;
                default:
                    break;
            }
            return param;
        }
        showGroupInfo(groupId) {
            this.selectItem(groupId,null);
        }
        getHeight() {
            var containerHeight = $(document).height() -
                    $("#breadcrumb-panel").height() -
                    $("#title-panel").height() -
                    $("#header-main-section").height() -
                    $("#outerFooter").height() -
                    $(".listActionItem .welcome").height() -
                    30;
            return {height: containerHeight};
        }
        nextItem(groupId, itemId) {
            var index = this.getIndex(groupId, itemId);
            if(index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            if(this.actionItems[index.group].items.length-1 <= index.item) {
                var firstItemId = this.actionItems[groupId].items[0].id;
                this.selectItem(groupId, firstItemId);
            } else {
                var nextItemId = this.actionItems[groupId].items[index.item+1].id;
                this.selectItem(groupId, nextItemId);
            }
        }
        selectItem(groupId, itemId) {
            var index = this.getIndex(groupId, itemId);
            if(index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            var selectionType = itemId===null ? "group":"actionItem";
            this.itemListViewService.getDetailInformation(groupId, selectionType, index.item===null?null:itemId).then((response:ISelectedData) => {
                this.selectedData = response;
            });
        }
        getIndex(groupId, itemId) {
            var index = {group:-1, item:null};
            var selectedGroup = this.actionItems.filter((group) => {
                return group.groupId === groupId;
            });
            if(selectedGroup.length!==-1) {
                index.group = this.actionItems.indexOf(selectedGroup[0]);
                var selectedItem = this.actionItems[groupId].items.filter((item) => {
                    return item.id === itemId;
                });
                if(selectedItem.length!==-1) {
                    index.item = this.actionItems[groupId].items.indexOf(selectedItem[0]);
                }
            }
            return index;
        }

        toggleDetail(state) {
            if(state.open) {
                this.itemListViewService.getDetailInformation(state.groupId, "group", null)
                    .then((response:ISelectedData) => {
                        this.selectedData = response;
                    })
            } else {
                this.selectedData = undefined;
            }
        }
        resetSelection() {
            this.selectedData = undefined;
        }

    }
}

register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);