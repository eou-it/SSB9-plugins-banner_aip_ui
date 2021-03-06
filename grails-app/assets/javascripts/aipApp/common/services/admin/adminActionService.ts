/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
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
        recurringPostId: string;
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
            posted:boolean;
            message: string;
            newActionItem: IActionItem2;
            updatedActionItem:IActionItem2;
            id:number;

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
        getPostStatus():ng.IHttpPromise<{}>;
        getJobDetails():ng.IHttpPromise<{}>;
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
                '?searchString=' + (encodeURIComponent(query.searchString) || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + (query.ascending.toString() || "")+
                '&offset=' + (query.offset || 0 )+
                '&max=' + realMax;

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
                '?searchParam=' + (encodeURIComponent(query.searchString) || '') +
                '&sortColumnName=' + (query.sortColumnName || 'postingName') +
                '&ascending=' + (query.ascending.toString() || "")+
                '&offset=' + (query.offset || 0 )+
                '&max=' + realMax;
            url = url + (query.recurringPostId? '&recurringPostId=' + query.recurringPostId :'');

            var params = {
                filterName: query.searchParam||"%",
                sortColumn: query.sortColumnName||"postingName",
                sortAscending: query.ascending||false,
                max: realMax||"",
                offset: query.offset || 0,
                recurringPostId : query.recurringPostId
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

        getPostStatus(postID)
        {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.statusPosted+"?postID=" + postID
            })
                .then((response: any) => {
                    return response.data;
                }, (err) => {
                    throw new Error(err);
                });
            return request;

        }

        getJobDetails(postID)
        {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.jobDetailsById+"?postID=" + postID
            })
                .then((response: any) => {
                    return response.data;
                }, (err) => {
                    throw new Error(err);
                });
            return request;

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

        getCurrentDateLocale(){
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.fetchCurrentDateInLocaleFormat
            });
            return request;
        }
        getCurrentTimeLocale(){
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.is12HourClock
            });
            return request;
        }
        getCurrentTimeZoneLocale(){
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.listAvailableTimezones
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

        loadBlockingProcessLov1(){
            {
                var request = this.$http({
                    method: "GET",
                    url: this.ENDPOINT.admin.loadBlockingProcessLov
                });
                return request;
            }
        }
        deleteStatus(status:{actionItemId:number}) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.deleteActionItem,
                data: status
            });
            return request;
        }
        savePostActionItem(postActionItem,selected,modalResult,selectedPopulation,postNow,sendTime,timeZone,regeneratePopulation,displayDatetimeZone) {
            var params = {
                postId:postActionItem.postId,
                postingName: postActionItem.name,
                postingActionItemGroupId: selected.groupId,
                actionItemIds: modalResult,
                populationId: selectedPopulation.id,
                displayStartDate:postActionItem.displayStartDate,
                displayEndDate:postActionItem.displayEndDate,
                postNow:''+postNow+'',
                scheduled:''+!postNow+'',
                scheduledStartDate:postActionItem.scheduledStartDate,
                scheduledStartTime:sendTime,
                timezoneStringOffset:timeZone,
                populationRegenerateIndicator:regeneratePopulation,
                displayDatetimeZone:displayDatetimeZone
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url:  postActionItem.postId? this.ENDPOINT.admin.updateActionItemPosting : this.ENDPOINT.admin.createPostActionItem
            });
            return request;
        }

        saveRecurringActionItem(postActionItem,selected,modalResult,selectedPopulation,regeneratePopulation,recurCount,recurFreqeunecy,displayStartDateOffset,recDisplayEndDateType,displayEndDateOffset,recurDisplayEndDate,recurranceStartDate,recurranceEndDate,recurrTime,recurrTimeZone,displayDatetimeZone){

            var params = {postId:postActionItem.postId,
                postingName: postActionItem.name,
                postingActionItemGroupId: selected.groupId,
                actionItemIds: modalResult,
                populationId: selectedPopulation.id,
                displayStartDate:postActionItem.displayStartDate,
                displayEndDate:postActionItem.displayEndDate,
                populationRegenerateIndicator:regeneratePopulation,
                recurFrequency:recurCount,
                recurFrequencyType:recurFreqeunecy.value,
                postingDispStartDays:displayStartDateOffset,
                postingDispEndDays:recDisplayEndDateType==='OFFSET'?displayEndDateOffset:null,
                postingDisplayEndDate:recDisplayEndDateType==='EXACT'?recurDisplayEndDate:null,
                recurStartDate:recurranceStartDate,
                recurEndDate:recurranceEndDate,
                recurStartTime:recurrTime,
                displayDatetimeZone:displayDatetimeZone,
                recurPostTimezone:recurrTimeZone
            }
            var request = this.$http({
                method: "POST",
                data: params,
                url:  postActionItem.postId? this.ENDPOINT.admin.updateRecurringActionItemPosting : this.ENDPOINT.admin.addRecurringActionItemPosting
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
                actionItemId:actionItem.id

            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        }
        checkActionItemPosted(actionItemId){
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.checkActionItemPosted+"?actionItemId=" + actionItemId
            })
                .then((response: any) => {
                    return response.data;
                }, (err) => {
                    throw new Error(err);
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
                actionItemId:actionItem.id


            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.editActionItem
            });
            return request;
        }

        getActionItemDetail(actionItemId) {
            var params={
                actionItemId:actionItemId
            }
            var request = this.$http({
                method: "GET",
                data: params,
                url: this.ENDPOINT.admin.openActionItem + "?actionItemId=" + actionItemId
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

        updateBlockedProcessItems(actionItemId,globalBlockProcess, blockedProcesses) {

            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateBlockedProcessItems,
                data: {
                    actionItemId: actionItemId,
                    globalBlockProcess:globalBlockProcess,
                    blockedProcesses:blockedProcesses
                }
            });
            return request;
        }

        fetchRecurringJobPostMetaData (recurringPostId) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.recurringActionItemPostMetaData +
                '?recurringPostId=' + recurringPostId ;
            var params = {
                recurringPostId : recurringPostId
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



    }
}

angular.module("bannerAIP").service("AdminActionService", AIP.AdminActionService);
angular.module("bannerAIP").service("dateFormatService", AIP.AdminActionService);
