///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {

    enum SelectionType {
        Group,
        ActionItem
    }

    export interface ISelectedData {
        type: SelectionType;
        id: number|string;
        info: {
            title: string;
            content: string;
            type: string;
        }
    }

    export interface IActionItem {
        description: string;
        id: number|string;
        name: string;
        state: string;
        title: string;
    }
    export interface IUserItem {
        id?: number|string;
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
        getDetailInformation(id:number|string, type:string):CSR.ISelectedData;
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
        getDetailInformation(id, selectType) {
            var detailInfo = <CSR.ISelectedData>{};
            //TODO:: get information for group/actionitem from grails controller
            switch (selectType) {
                case "group":
                    detailInfo = {
                        type: SelectionType.Group,
                        id: id,
                        info: {
                            title: "same as group title",
                            content: "Detail instruction/info of group " + id,
                            type: "doc"
                        }
                    };
                    break;
                case "actionItem":
                    detailInfo = {
                        type: SelectionType.ActionItem,
                        id: id,
                        info: {
                            title: "same as action item name",
                            content: "Detail information of action item " + id,
                            type: "doc"
                        }
                    };
                default:
                    break;
            }
            return detailInfo;
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