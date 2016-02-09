///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/csrUserService.ts"/>

declare var register;

module CSR {

    interface IListItemPageCtrl {
        itemListViewService: CSR.ItemListViewService;
        userService: CSR.UserService;
        actionItems: IUserItem[];
        openConfirm(row):void;
        getParams(title:string):string[];
    }

    export class ListItemPageCtrl implements IListItemPageCtrl{
        $inject = ["$scope", "$state", "ItemListViewService", "CSRUserService"];
        itemListViewService:CSR.ItemListViewService;
        userService:CSR.UserService;
        actionItems:IUserItem[];
        $state;

        constructor($scope, $state, ItemListViewService, CSRUserService) {
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = CSRUserService;
            this.actionItems = this.itemListViewService.userItems;
            //sync with service's userItems
            $scope.$watch (  ( )=> {
                return this.itemListViewService.userItems;}, (newVal) => {
                this.actionItems = newVal;
                angular.forEach(this.actionItems, (item) => {
                    item.dscParams = this.getParams(item.info.title);
                })
            });
        }
        openConfirm(row) {
            this.$state.go("listConfirm", {itemId:row.id});
        }
        getParams(title) {
            var param = [];
            switch (title) {
                case "csr.user.list.header.title.registration":
                    param.push(this.userService.userInfo.preferredName||this.userService.userInfo.firstName);
                    break;
                case "csr.user.list.header.title.graduation":
                    param.push(this.userService.userInfo.graduateCredit);
                    break;
                default:
                    break;
            }
            return param;
        }

    }
}

register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);