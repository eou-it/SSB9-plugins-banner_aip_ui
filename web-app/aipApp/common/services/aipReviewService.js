/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AIPReviewService = /** @class */ (function () {
        function AIPReviewService($http, $q, ENDPOINT, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.ENDPOINT = ENDPOINT;
        }
        AIPReviewService.prototype.getActionItemList = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.listActionItem
            });
            return request;
        };
        AIPReviewService.$inject = ["$http", "$q", "ENDPOINT", "APP_PATH"];
        return AIPReviewService;
    }());
    AIP.AIPReviewService = AIPReviewService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
