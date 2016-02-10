///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {

    interface IActionItem {
        description: string;
        id: number|string;
        name: string;
        state: string;
        title: string;
    }
    export interface IUserItem {
        header:string[];
        name: string;
        dscParams?:string[];
        items: IActionItem[];
        info: {
            description: string;
            title: string;
        }
    }
    interface IActionItemResponse {
        data: IUserItem[];
    }

    interface IItemListViewService {
        userItems: IUserItem[];
        getActionItems():ng.IHttpPromise<IUserItem[]>;
        confirmItem(id:string|number):void;
    }

    export class ItemListViewService implements IItemListViewService{
        static $inject=["$http"];
        $http: ng.IHttpService;
        userItems: IUserItem[];
        constructor($http:ng.IHttpService) {
            this.$http = $http;
            this.init();
        }
        init() {
            this.getActionItems().then((response:IActionItemResponse) => {
                this.userItems = response.data;
            }, (errorResponse) => {
                console.log(errorResponse);
            });
        }
        getActionItems() {
           var request = this.$http({
                method:"POST",
                url: "csrTest/actionItems"
            });
            return request;
        }
        confirmItem(id) {
            //TODO: update datbase
            angular.forEach(this.userItems, (item) => {
                angular.forEach(item.items, (_item) => {
                    if(_item.id == id) {
                        _item.state = "csr.user.list.item.state.complete";
                    }
                });
            });
        }
    }
}

register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);