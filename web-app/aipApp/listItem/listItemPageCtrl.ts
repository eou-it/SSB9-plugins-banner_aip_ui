///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/userService.ts"/>

declare var register;

module AIP {


    interface IListItemPageCtrl {
        itemListViewService: AIP.ItemListViewService;
        userService: AIP.UserService;
        actionItems: IUserItem;
        selectedData: ISelectedData;
        initialOpenGroup: number;
        getInitialSelection(): number;
        openConfirm(groupId:string|number, row):void;
        getParams(title:string, userInfo:AIP.IUserInfo):string[];
        styleFunction(key:string):string;
        showGroupInfo(idx:number);
        getHeight(): {height:number};
        nextItem(groupId:string|number, itemId:number): void;
        selectItem(groupId: number|string, itemId:number|string): void;
        toggleDetail(state:{idx:number|string, open:boolean}):void;
        resetSelection():void;
    }

    export class ListItemPageCtrl implements IListItemPageCtrl{
        $inject = ["$scope", "$state", "ItemListViewService", "AIPUserService", "SpinnerService", "$timeout",
            "$window", "$q", "$uibModal", , "APP_ROOT"];
        itemListViewService:AIP.ItemListViewService;
        userService:AIP.UserService;
        actionItems:IUserItem;
        $uibModal;
        initialOpenGroup;
        spinnerService;
        userName;
        selectedData: ISelectedData;
        $timeout;
        $state;
        $q;
        APP_ROOT;
        modalInstance;

        constructor($scope, $state, ItemListViewService, AIPUserService, SpinnerService, $timeout, $window, $q, $uibModal, APP_ROOT) {
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
            this.informModal()
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then((userData) => {
                var userInfo = userData;
                this.userName = userData.fullName;
                this.itemListViewService.getActionItems(userInfo).then((actionItems:IUserItem) => {
                    angular.forEach(actionItems.groups, (group) => {
                        angular.forEach(group.items, (item) => {
                            item.state = item.state==="Completed"?
                                "aip.status.complete":
                                "aip.status.pending";
                        });
                    });
                    this.actionItems = actionItems;
                    angular.forEach(this.actionItems.groups, (item) => {
                        item.dscParams = this.getParams(item.title, userInfo);
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
            if(this.actionItems.groups.length > 1) {
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
                case "aip.user.list.header.title.registration":
                    param.push(userInfo.fullName||userInfo.firstName);
                    break;
                case "aip.user.list.header.title.graduation":
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
            var defer = this.$q.defer();
            var index = this.getIndex(groupId, itemId);
            if(index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            var selectionType = itemId===null ? "group":"actionItem";
            var group = this.actionItems.groups.filter((item) => {
                return item.id === groupId;
            });
            var actionItem = group[0].items.filter((item) => {
                return item.id === itemId;
            });
            this.itemListViewService.getDetailInformation(groupId, selectionType, index.item===null?null:itemId).then((response:ISelectedData) => {
                this.selectedData = response;
                this.selectedData.info.title= actionItem[0].title;
                defer.resolve();
            })
            return defer.promise;
        }
        getIndex(groupId, itemId) {
            var index = {group:-1, item:null};
            var selectedGroup = this.actionItems.groups.filter((group) => {
                return group.id === groupId;
            });
            if(selectedGroup.length!==-1) {
                index.group = this.actionItems.groups.indexOf(selectedGroup[0]);
                // var selectedItem = this.actionItems[groupId].items.filter((item) => {
                //     return item.id === itemId;
                // });
                var selectedItem = this.actionItems.groups.filter((item) => {
                    return item.id === groupId;
                });
                if(selectedItem.length!==-1) {
                    index.item = this.actionItems.groups.indexOf(selectedItem[0]);
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

        informModal() {
            console.log("inform")
            this.modalInstance = this.$uibModal.open( {
                templateUrl: this.APP_ROOT + "listItem/itemInform/itemInformTemplate.html",
                controller: "ItemInformCtrl"
            } );
        }

        /*
         getCustomPage(id,actionItemId) {
            var defer = this.$q.defer();
            var customPageId = id || "ActionItemPolicy"; //TODO: get id from selectedData (later)
            var actionItemId = actionItemId || "3";
            var request = this.itemListViewService.getPagebuilderPage(customPageId,actionItemId ).then( (response:any) => {
                defer.resolve();
            });
            return defer.promise;
        }
        */

    }
}

register("bannerAIP").controller("ListItemPageCtrl", AIP.ListItemPageCtrl);