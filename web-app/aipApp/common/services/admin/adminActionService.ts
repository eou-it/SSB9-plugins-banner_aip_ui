/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
        actionItemActivityDate: Date;
        actionItemCompositeDate: Date;
        actionItemCreateDate: Date;
        actionItemCreatorId: string;
        actionItemLastUserId: string;
        actionItemDesc: string;
        actionItemName: string;
        actionItemStatus: string|number;
        folderId: string;
        folderName: string;
    }
    interface IActionItem2 {
        id: number;
        activityDate: Date;
        createDate: Date;
        creatorId: string;
        description: string;
        title: string;
        status: string|number;
        folder?: IFolder;
        group?:IGroup;
        folderId?: string;
        folderName?: string;
        actionItemContent?:string;
        actionItemContentId?:number;
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
    export interface IGroup {
        groupId: number;
        groupName: string;
        groupTitle: string;
    }
    export interface IPopulation {
        groupId: number;
        groupName: string;
        groupTitle: string;
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
    export interface IPostActionItemGroupResponse {
        data: [IGroup];
    }
    export interface IPostActionItemPopulationResponse {
        data: [IPopulation];
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
    export interface IPostActionItemParam{
        groupId: number;
        groupName: string;
        groupTitle: string;
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
        fetchData(query:IActionItemListQuery):ng.IPromise<{}>;
        getFolder(): ng.IHttpPromise<{}>;
        getStatus(): ng.IHttpPromise<{}>;
        saveActionItem(actionItem: IActionItemParam): ng.IHttpPromise<{}>;
        getActionItemDetail(actionItemId:number): ng.IHttpPromise<{}>;
    }

    enum Status {
        Draft=1, Active=2, Inactive=3
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
            var url = this.ENDPOINT.admin.actionItemList +
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
        }
        getFolder() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        }
        getGrouplist() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getGroupLov
            });
            return request;
        }
        getPopulationlist(){
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.populationListForSendLov
            });
            return request;
        }

        getStatus() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.adminActionItemStatus
            });
            return request;
        }
        getBlockedProcess(actionItemId?) {
            var url = actionItemId ? this.ENDPOINT.admin.blockedProcessList + "?actionItemId=" + actionItemId :
                this.ENDPOINT.admin.blockedProcessList;
            var request = this.$http({
                method: "GET",
                url: url
            });
            return request;
        }
        saveActionItem(actionItem) {
            var params = {
                title: actionItem.title,
                name: actionItem.name,
                folderId: parseInt(actionItem.folder.id),
                description: actionItem.description,
                status: Status[actionItem.status.id],

            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        }
        updateActionItemContent(actionItem) {
            var params = {
                actionItemContentId:  parseInt(actionItem.actionItemContentId),
                actionItemContent: actionItem.actionItemContent,
                templateId: parseInt(actionItem.templateId)
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.editActionItemContent
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
        getActionItemTemplates() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemTemplateList
            });
            return request;
        }
        getActionItemBlocks() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemTemplateList
            });
            return request;
        }
        saveActionItemTemplate(templateId, actionItemId, actionItemContent) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.saveActionItemTemplate,
                data: {
                    templateId: templateId,
                    actionItemId: actionItemId,
                    actionItemContent: actionItemContent
                }
            });
            return request;
        }
        updateActionItemStatusRule(rules, actionItemId) {
            console.log(rules);
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateActionItemStatusRule,
                data: {
                    rules: rules,
                    actionItemId: actionItemId
                }
            });
            return request;
        }

        updateActionItemDetailsAndStatusRules( templateId, actionItemId, actionItemContent, rules ) {
            var request = this.$http( {
                method: "POST",
                url: this.ENDPOINT.admin.updateActionItemStatusRule,
                data: {
                    templateId: templateId,
                    actionItemId: actionItemId,
                    actionItemContent: actionItemContent,
                    rules: rules
                }
            } );
            return request;
        }
        updateBlockedProcessItems(actionItemId, blockItems) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateBlockedProcessItems,
                data: {
                    actionItemId: actionItemId,
                    blockItems: blockItems
                }
            });
            return request;
        }
    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);