/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module AIP {
    export interface IActionItemListQuery {
        searchString: string;
        sortColumnName: string;
        ascending: string;
        offset: string;
        max: string;
    }
    interface IActionItem {
        actionItemId: number;
        actionItemActivityDate: Date,
        actionItemCreateDate: Date,
        actionItemCreatorId: string;
        actionItemDesc: string;
        actionItemName: string;
        actionItemStatus: string|number;
        folderId: string;
        folderName: string;
    }
    interface IActionItem2 {
        id: number;
        activityDate: Date,
        createDate: Date,
        creatorId: string;
        description: string;
        title: string;
        status: string|number;
        folder?: IFolder;
        folderId?: string;
        folderName?: string;
    }
    export interface IActionItemHeader {
        name: string;
        title: string;
        ariaLabel?: string;
        options: {
            visible: boolean,
            inSortable?: boolean,
            sortable?: boolean,
            ascending?: boolean,
            columnShowHide?: boolean
        },
        width: any
    }
    export interface IFolder {
        id: number;
        dataOrigin: string;
        description: string;
        internal: boolean;
        lastModified: Date;
        lastModifiedBy: string;
        name: string;
    }
    export interface IStatus {
        id: number;
        value: string;
    }
    export interface IActionItemFetchResponse {
        result: [IActionItem],
        length: number;
        header: [IActionItemHeader]
    }
    export interface IActionItemFolderResponse {
        data: [IFolder];
    }
    export interface IActionItemStatusResponse {
        data: [IStatus]
    }
    export interface IActionItemParam {
        title: string;
        status: string;
        folderId: number;
        description: string;
    }
    export interface IActionItemSaveResponse {
        data: {
            success: boolean;
            message: string;
            newActionItem: IActionItem2;
        };
    }
    export interface IActionItemOpenResponse {
        data: {
            success: boolean;
            errors: [any];
            actionItem: IActionItem2;
        };
    }
    interface IAdminActionService {
        fetchData(query:IActionItemListQuery):ng.IPromise<IActionItemFetchResponse>;
        getFolder(): ng.IHttpPromise<IActionItemFolderResponse>;
        getStatus(): ng.IHttpPromise<IActionItemStatusResponse>;
        saveActionItem(actionItem: IActionItemParam): ng.IHttpPromise<IActionItemSaveResponse>;
        getActionItemDetail(actionItemId:number): ng.IHttpPromise<IActionItemOpenResponse>;
    }

    enum ActionItemStatus {
        Pending=0, Active=1, Inactive=2
    }
    export class AdminActionService implements IAdminActionService{
        static $inject=["$http", "$q", "$filter", "ENDPOINT"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        $filter;
        ENDPOINT;
        constructor($http:ng.IHttpService, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
            this.ENDPOINT = ENDPOINT;
        }

        fetchData (query:IActionItemListQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset.toString() || '') +
                '&max=' + (realMax.toString() || '');
            this.$http({
                method: "GET",
                url: url
            }).then((response:any)=> {
                deferred.resolve(response.data);
            }, (data) => {
                deferred.reject(data);
            })

            return deferred.promise;
        };
        getFolder() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };
        getStatus() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemStatus
            });
            return request;
        }
        saveActionItem(actionItem) {
            var params = {
                title: actionItem.title,
                folderId: parseInt(actionItem.folder),
                description: actionItem.description,
                status: ActionItemStatus[actionItem.status]
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        }
        getActionItemDetail(actionItemId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.openActionItem + "?actionItemId=" + actionItemId.toString()
            });
            return request;

        }
    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);