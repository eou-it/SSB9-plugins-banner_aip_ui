/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
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
    export interface IPostActionItemListQuery {
        searchString: string;
        searchParam: string;
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
    interface IPostActionItem {
        id: number;
        lastModified: Date;
        postingCreationDateTime: Date;
        postingDisplayEndDate: Date;
        postingDisplayStartDate: Date;
        lastModifiedBy: string;
        jobState:string;
        postingName: string;
        populationListId: string;
        postingActionItemGroupId: string;
        postingJobId: string;
        postingGroupId: string;
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
    interface IPostActionItem2{
        id:number;
        name: number,
        postGroupId: number,
        actionItemIds: number,
        populationId: number,
        displayStartDate:Date,
        displayEndDate:Date,
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
    export interface IPostActionItemHeader {
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
        id:  string|number|boolean;
        dataOrigin: string;
        description?: string;
        internal: boolean;
        lastModified?: Date|string;
        lastModifiedBy?: string;
        name: string;
    }
    export interface IGroup {
        groupId: number;
        groupName: string;
        groupTitle: string;
    }
    export interface IGroupActionItem {
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
        id: string|number;
        value: string;
    }
    export interface IActionItemFetchResponse {
        result: [IActionItem],
        length: number;
        header: [IActionItemHeader]
    }
    export interface IPostActionItemFetchResponse {
        result: [IPostActionItem],
        length: number;
        header: [IPostActionItemHeader]
    }
    export interface IActionItemFolderResponse {
        data: [IFolder];
    }
    export interface IPostActionItemGroupResponse {
        data: [IGroup];
    }
    export interface IPostActionItemResponse {
        data: [IGroupActionItem];
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
            newActionItem1:IActionItem3;
        };
    }
    export interface IPostActionItemSaveResponse {
        data: {
            success: boolean;
            message: string;
            savedJob: IPostActionItem2;
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
    interface IPostAdminActionService {
        fetchTableData(query:IPostActionItemListQuery):ng.IPromise<{}>;
        getFolder(): ng.IHttpPromise<{}>;
        getStatus(): ng.IHttpPromise<{}>;
        savePostActionItem(actionItem: IActionItemParam): ng.IHttpPromise<{}>;
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

        fetchTableData (query:IPostActionItemListQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemPostJobList +
                '?searchParam=' + (query.searchString || '') +
                '&offset=' + (query.offset.toString() || '') +
                '&max=' + (realMax.toString() || '');
            var params = {
                filterName: query.searchParam||"%",
                sortColumn: query.sortColumnName||"id",
                sortAscending: query.ascending||false,
                max: realMax||"",
                offset: query.offset || 0
            };
            this.$http({
                method: "GET",
                url: url,
                data: params
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
        getGroupActionItem(groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getActionGroupActionItemLov+ "?searchParam=" + groupId
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
        deleteStatus(status:{actionItemId:number}) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.deleteActionItem,
                data: status
            });
            return request;
        }
        savePostActionItem(postActionItem,selected,modalResult,selectedPopulation,postNow,regeneratePopulation) {
            var params = {
                postingName: postActionItem.name,
                postingActionItemGroupId: selected.groupId,
                actionItemIds: modalResult,
                populationId: selectedPopulation.id,
                displayStartDate:postActionItem.startDate,
                displayEndDate:postActionItem.endDate,
                postNow:''+postNow+'',
                populationRegenerateIndicator:regeneratePopulation
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createPostActionItem
            });
            return request;
        }

        saveActionItem(actionItem) {
            var params = {
                title: actionItem.title,
                name: actionItem.name,
                folderId: parseInt(actionItem.folder.id),
                description: actionItem.description,
                status: actionItem.status,

            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        }

        editActionItems(actionItem) {
                var params = {
                    title: actionItem.title,
                    name: actionItem.name,
                    folderId: parseInt(actionItem.folder.id),
                    description: actionItem.description,
                    status: actionItem.status,
                    actionItemId:actionItem.id,


                };
                var request = this.$http({
                    method: "POST",
                    data: params,
                    url: this.ENDPOINT.admin.editActionItem
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
register("bannerAIP").service("dateFormatService", AIP.AdminActionService);
