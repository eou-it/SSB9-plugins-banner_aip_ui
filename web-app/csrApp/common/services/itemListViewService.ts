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
        getActionItems(userInfo):void;
        confirmItem(id:string|number):void;
    }

    export class ItemListViewService implements IItemListViewService{
        static $inject=["$http"];
        $http: ng.IHttpService;
        constructor($http:ng.IHttpService) {
            this.$http = $http;
        }
        getActionItems(userInfo) {
            var request = this.$http({
                method:"POST",
                url: "csr/actionItems",
                data: userInfo
               })
               .then((response:IActionItemResponse) => {
                   return response.data;
               }, (err) => {
                   throw new Error(err);
               });
            return request;
        }
        confirmItem(id) {
            //TODO: update datbase
            //angular.forEach(this.userItems, (item) => {
            //    angular.forEach(item.items, (_item) => {
            //        if(_item.id == id) {
            //            _item.state = "csr.user.list.item.state.complete";
            //        }
            //    });
            //});
        }
    }
}

register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);