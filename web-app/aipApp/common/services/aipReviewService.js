/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AIPReviewService = (function () {
        function AIPReviewService($http, $q, ENDPOINT, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.ENDPOINT = ENDPOINT;
        }
        AIPReviewService.prototype.getActionItemList = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.listActionItemNames
            });
            return request;
        };
        AIPReviewService.prototype.fetchSearchResult = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.review.search +
                '?actionItemId=' + (query.actionItemId || '') +
                '?personName=' + (query.actionItemId || '') +
                '?personId=' + (query.actionItemId || '') +
                '&searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0) +
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
        };
        AIPReviewService.$inject = ["$http", "$q", "ENDPOINT", "APP_PATH"];
        return AIPReviewService;
    })();
    AIP.AIPReviewService = AIPReviewService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
//# sourceMappingURL=aipReviewService.js.map