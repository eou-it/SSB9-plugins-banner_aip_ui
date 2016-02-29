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
        getParams(title:string, userInfo:CSR.IUserInfo):string[];
        styleFunction(key:string):string;
    }

    export class ListItemPageCtrl implements IListItemPageCtrl{
        $inject = ["$scope", "$state", "ItemListViewService", "CSRUserService", "SpinnerService", "$timeout"];
        itemListViewService:CSR.ItemListViewService;
        userService:CSR.UserService;
        actionItems:IUserItem[];
        spinnerService;
        $timeout;
        $state;

        constructor($scope, $state, ItemListViewService, CSRUserService, SpinnerService, $timeout) {
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = CSRUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.init();
        }
        init() {
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then((userData) => {
                var userInfo = userData;
                this.itemListViewService.getActionItems(userInfo).then((actionItems) => {
                    this.actionItems = actionItems;
                    angular.forEach(this.actionItems, (item) => {
                        item.dscParams = this.getParams(item.info.title, userInfo);
                    });
                });
                this.spinnerService.showSpinner(false)
            });
        }
        openConfirm(row) {
            var elem = angular.element(document.querySelector('[ng-app]'));
            var $rootScope = elem.injector().get("$rootScope");
            $rootScope.$state.go("listConfirm", {itemId:row.id});
        }
        styleFunction(key) {
            var returnClass = "";
            switch (key) {
                case "title":
                    returnClass = "col-xs-8 col-sm-4";
                    break;
                case "state":
                    returnClass = "col-xs-4 col-sm-2";
                    break;
                case "description":
                    returnClass = "col-xs-12 clearfix col-sm-6 ";
                    break;
            }
            return returnClass + " cell " + key;
        }
        getParams(title, userInfo) {
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

    }
}

register("bannercsr").controller("ListItemPageCtrl", CSR.ListItemPageCtrl);