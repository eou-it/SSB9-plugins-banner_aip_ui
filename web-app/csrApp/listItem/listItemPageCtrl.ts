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
        openConfirm(row):void;
        getParams(title:string, userInfo:CSR.IUserInfo):string[];
        styleFunction(key:string):string;
        showGroupInfo(idx:number);
        getHeight(): {height:number};
        nextItem(): void;
        selectFirstItem(idx:number|string): ISelectedData;
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
                        this.selectedData = this.itemListViewService.getDetailInformation(this.initialOpenGroup, "group");
                    }

                });
            });
        }
        getInitialSelection() {
            var defaultSelection= 0;
            if(this.actionItems.length > 1) {
                this.initialOpenGroup = -1;
            }
            return defaultSelection;
            //TODO:: when multiple group available, first available group could be opened
        }
        openConfirm(row) {
            this.selectedData = this.itemListViewService.getDetailInformation(row.id, "actionItem");
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
        showGroupInfo(idx) {
            //TODO:: open selected group info's group accordion
            this.selectedData = this.itemListViewService.getDetailInformation(idx, "group");
        }
        getHeight() {
            var containerHeight = $(document).height() -
                    $("#header-main-section").height() -
                    $("#outerFooter").height() -
                    $(".listActionItem .welcome").height() -
                    35;
            return {height: containerHeight};
        }
        nextItem() {
            console.log(this.selectedData);
            var selected;
            switch(this.selectedData.type) {
                case 0:     //group
                    selected = this.selectFirstItem(this.selectedData.id);
                    break;
                case 1:     //action item
                    break;
                default:
                    break;
            }
            this.selectedData = selected;
        }
        selectFirstItem(idx) {
            var selected;
            var firstItem = this.actionItems[idx].items.filter( (item) => {
                return item.state === "csr.user.list.item.state.pending";
            });
            if(firstItem.length===0 ) {
                if(this.actionItems[idx+1]) {
                    selected = this.selectFirstItem(idx + 1);
                }
            } else {
                selected = this.itemListViewService.getDetailInformation(firstItem[0].id, "actionItem");
            }
            return selected;
        }
        toggleDetail(state) {
            if(state.open) {
                this.selectedData = this.itemListViewService.getDetailInformation(state.idx, "group");
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