/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module AIP {

    export interface ISearchActionItemQuery {
        actionItemId:number;
        personName:string;
        personId:string;
        searchString: string;
        sortColumnName: string;
        ascending: string;
        offset: string;
        max: string;
    }

    interface IAIPReviewService {
        getActionItemList();
        fetchSearchResult(query:ISearchActionItemQuery);

    }

    export class AIPReviewService implements IAIPReviewService {
        static $inject = ["$http", "$q", "ENDPOINT", "APP_PATH"];
        $http:ng.IHttpService;
        $q:ng.IQService;
        APP_PATH;
        ENDPOINT;

        constructor($http:ng.IHttpService, $q:ng.IQService, ENDPOINT, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.ENDPOINT = ENDPOINT;
        }

        getActionItemList() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.listActionItemNames
            })
            return request;
        }

        fetchSearchResult(query:ISearchActionItemQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.review.search +
                '?actionItemId=' + (query.actionItemId || '') +
                '&personName=' + (query.personName || '') +
                '&personId=' + (query.personId || '') +
                '&searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || '') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0 ) +
                '&max=' + realMax;

            var request = this.$http({
                method: "GET",
                url: url
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;

        }

        getActionItem(userActionItemID) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.getActionItem + "?userActionItemID=" + userActionItemID
            })
            return request;
        }
    }
}
register("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
