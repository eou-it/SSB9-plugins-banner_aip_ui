///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {

    enum SelectionType {
        Group,
        ActionItem
    }

    export interface ISelectedData {
        type: SelectionType;
        groupId: number|string;
        info: {
            id?: number|string;
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
        groupId: number|string;
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
        getDetailInformation(groupId: number|string, type:string, id:number|string);
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
        getDetailInformation(groupId, selectType, actionItemId) {
            var request = this.$http({
                method: "POST",
                url: "csr/detailInfo",
                data: {type:selectType, groupId: groupId, actionItemId:actionItemId}
            })
                .then((response:any) => {
                    var data = response.data[0];
                    return {
                        type: selectType,
                        groupId: groupId,
                        info: {
                            content: data.text,
                            type: "doc",
                            id: data.actionItemId||data.groupId,
                            title: "TEST",
                            detailId: data.id,
                            //detailVersion: data.version,
                            //userId: data.userId,
                            //origin: data.dataOrigin,
                            //activityDate: data.activityDate
                        }
                    };
                }, (err) => {
                    throw new Error(err);
                })
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