/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module AIP {
    export interface IActionItemStatusListQuery {
        searchString: string;
        sortColumnName: string;
        ascending: string;
        offset: string;
        max: string;
    }
    export interface IActionItemStatus {
        actionItemStatusId: number;
        actionItemStatus: string;
        actionItemStatusActivityDate: Date,
        actionItemStatusUserId: string;
        actionItemStatusBlockedProcess: string;
        actionItemStatusActive: string;
        actionItemStatusSystemRequired: string;
    }
    export interface IActionItemStatusHeader {
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
    export interface IActionItemStatusFetchResponse {
        result: [IActionItemStatus],
        length: number;
        header: [IActionItemStatusHeader]
    }
    export interface IActionItemStatusParam {
        title: string;
        status: string;
        folderId: number;
        description: string;
    }
    /*
    export interface IActionItemStatusSaveResponse {
        data: {
            success: boolean;
            message: string;
            newActionItem: IActionItemStatus;
        };
    }
    export interface IActionItemStatusOpenResponse {
        data: {
            success: boolean;
            errors: [any];
            actionItem: IActionItemStatus;
        };
    }
    */
    interface IAdminActionStatusService {
        fetchData(query:IActionItemStatusListQuery):ng.IPromise<IActionItemStatusFetchResponse>;
        //saveActionItem(actionItemStatus: IActionItemStatusParam): ng.IHttpPromise<IActionItemStatusSaveResponse>;
       // getActionItemStatusDetail(actionItemStatusId:number): ng.IHttpPromise<IActionItemStatusOpenResponse>;
    }

    export class AdminActionStatusService implements IAdminActionStatusService{
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

        fetchData (query:IActionItemStatusListQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemStatusGrid +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemStatus') +
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
        saveStatus (status:{title:string, block:boolean}) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.statusSave,
                data: status
            });
            return request;
        }


        getRules(actionItemId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.rulesByActionItem + "?actionItemId=" + actionItemId
            });
            return request;
        }

        /*
        getFolder() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };

        */
        /*
        saveActionItem(actionItemStatus) {
            var params = {
                actionItemStatus: actionItemStatus.actionItemStatus,
                actionItemBlockedProcess: actionItemStatus.actionItemStatusBlockedProcess,
                actionItemSystemRequired: actionItemStatus.actionItemSystemRequired,
                actionItemActive: actionItemStatus.actionItemActive
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        }


        getActionItemStatusDetail(actionItemStatusId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.openActionItemStatus + "?actionItemStatusId=" + actionItemStatusId.toString()
            });
            return request;
        }
        */
    }
}

register("bannerAIP").service("AdminActionStatusService", AIP.AdminActionStatusService);