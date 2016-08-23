/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module AIP {

    interface IAdminActionService {

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
        getActionLists() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionList
            });
            return request;
        }
        fetchData (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + query.ascending +
                '&offset=' + (query.offset || '') +
                '&max=' + (query.max || '');
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var params = {
                filterName: query.searchString||"%",
                sortColumn: query.sortColumnName||"id",
                sortAscending: query.ascending||false,
                max: realMax||"",
                offset: query.offset || 0
            };
            this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.actionItemList,
                data: params
            }).then((response:any)=> {
                deferred.resolve(response.data);
            }, (data) => {
                deferred.reject(data);
            })

            return deferred.promise;
        };
        getFolder() {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };
        getStatus() {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.actionItemStatus
            });
            return request;
        }
        saveActionItem(actionItem) {
            var params = {};
            var request = this.$http({
                method: "POST",
                data: params,
                url: ""
            });
            return request;
        }
    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);