/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module AIP {

    export interface ISearchActionItemQuery {
        actionItemId: number;
        personName: string;
        personId: string;
        searchString: string;
        sortColumnName: string;
        ascending: string;
        offset: string;
        max: string;
    }


    export interface IAttachmentListQuery {
        responseId: number;
        userActionItemId: number;
        searchString: string;
        sortColumnName: string;
        ascending: string;
        offset: string;
        max: string;
    }

    interface IAIPReviewService {
        getActionItemList();
        fetchSearchResult(query: ISearchActionItemQuery);
        getReviewStatusList();
        updateActionItemReview(params);
    }

    export class AIPReviewService implements IAIPReviewService {
        static $inject = ["$http", "$q", "ENDPOINT", "APP_PATH"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        APP_PATH;
        ENDPOINT;

        constructor($http: ng.IHttpService, $q: ng.IQService, ENDPOINT, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.ENDPOINT = ENDPOINT;
        }

        getActionItemList() {
            let request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.listActionItemNames,
                cache:true
            });
            return request;
        }

        fetchSearchResult(query: ISearchActionItemQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.review.search +
                '?actionItemId=' + (query.actionItemId || '') +
                '&personName=' + (encodeURIComponent(query.personName?query.personName:'') || '') +
                '&personId=' + (encodeURIComponent(query.personId?query.personId:'') || '') +
                '&searchString=' + (encodeURIComponent(query.searchString?query.searchString:'') || '') +
                '&sortColumnName=' + (query.sortColumnName || '') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0) +
                '&max=' + realMax;

            var request = this.$http({
                method: "GET",
                url: url,
                cache:true
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;

        }

        /**
         * Gets list of attached document for a response.
         * @param query
         */
        fetchAttachmentsList(query: IAttachmentListQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.APP_PATH + "/aipReview/listDocuments" +
                '?userActionItemId=' + (query.userActionItemId || '') +
                '&responseId=' + (query.responseId || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0) +
                '&max=' + realMax;
            this.$http({
                method: "GET",
                url: url
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }

        /**
         * Preview of document.
         * @param row
         */
        previewDocument(row) {
            var data = {
                documentId   : row.id,
                fileLocation : row.fileLocation
            };
            var request = this.$http({
                method: "POST",
                url: this.APP_PATH + "/aipDocumentManagement/previewDocument",
                data: data
            });
            return request;
        }

        getActionItem(userActionItemID) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.getActionItem + "?userActionItemID=" + userActionItemID
            })
            return request;
        }

        getReviewStatusList() {
            var deferred = this.$q.defer();
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.getReviewStatusList
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        }

        updateActionItemReview(params) {
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.review.updateActionItemReview
            });
            return request;
        }

        getContactInformation() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.listContactInformation
            })
            return request;
        }
    }
}
angular.module("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
angular.module("bannerCommonAIP").service("dateFormatService", AIP.AIPReviewService);

