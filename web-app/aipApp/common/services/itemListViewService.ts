/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;
declare var params;

module AIP {

    enum SelectionType {
        Group,
        ActionItem
    }

    export interface ISelectedData {
        type: SelectionType;
        groupId: number|string;
        info: {
            id?: number|string;
            title?: string;
            content: string;
            type: string;
            page: string;
        }
    }

    export interface IActionItem {
        description: string;
        id: number|string;
        name: string;
        state: string;
        title: string;
        completedDate: string;
    }
    export interface IGroup {
        id: number| string;
        title: string;
        dscParams?:string[];
        items: IActionItem[];
    }
    export interface IUserItem {
        groups: IGroup[],
        header:string[];
    }
    interface IActionItemResponse {
        data: IUserItem;
    }

    interface IItemListViewService {
        getActionItems(userInfo):ng.IPromise<IUserItem>;
        confirmItem(id:string|number):void;
        getDetailInformation(groupId: number|string, type:string, id:number|string);
    }

    export class ItemListViewService implements IItemListViewService{
        static $inject=["$http", "$q", "APP_PATH"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        APP_PATH;
        constructor($http:ng.IHttpService, $q:ng.IQService, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
        }
        getActionItems(userInfo) {
            var request = this.$http({
                method:"POST",
                url: this.APP_PATH + "/aip/actionItems",
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
                method: "GET",
                url: this.APP_PATH + "/aip/detailInfo?searchType="+selectType+"&groupId="+groupId+"&actionItemId="+actionItemId
            })
                .then((response:any) => {
                    var returnData;

                    if (selectType === "group") {
                        returnData = {
                            content: response.data[0].text,
                            type: "doc",
                            id: groupId,
                            templateId: "",
                            detailId: response.data[0].id,
                            title: response.data[0].title
                        }
                    } else if (selectType === "actionItem") {
                        returnData = {
                            content: response.data[0].text,
                            type: "doc",
                            id: response.data[0].id,
                            templateId: response.data[0].actionItemTemplateId,
                            detailId: response.data[0].id,
                            title: response.data[0].title,
                            page: response.data[1].actionItemPageName
                        }

                        console.log(returnData);
                    }
                    return {
                        type: selectType,
                        groupId: groupId,
                        info: returnData
                    };
                }, (err) => {
                    throw new Error(err);
                })
            return request;
        }

        getPagebuilderPage(id:any, actionItemId:any, groupId:any) {
            var defer = this.$q.defer();
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipPageBuilder/page?id=" + id
            })
                .then((response:any) => {
                    var data = response.data;
                    $.ajax({
                        url: this.APP_PATH + "/aipPageBuilder/pageScript?id=" + id + "&actionItemId=" + actionItemId + "&groupId=" + groupId,
                        dataType: 'script',
                        success: function() {
                            angular.module("BannerOnAngular").controller(data.controllerId, data.controllerId);
                            params = {action: "page", controller: "customPage", id: data.pageName, actionItemId: actionItemId, groupId:groupId, saved:false};
                            defer.resolve(data);
                        },
                        async: true
                    });
                }, (err) => {
                    throw new Error(err);
                })
            return defer.promise;
        }

        confirmItem(id) {
            //TODO: update datbase
            //angular.forEach(this.userItems, (item) => {
            //    angular.forEach(item.items, (_item) => {
            //        if(_item.id == id) {
            //            _item.state = "aip.user.list.item.state.complete";
            //        }
            //    });
            //});
        }
    }
}

register("bannerAIP").service("ItemListViewService", AIP.ItemListViewService);