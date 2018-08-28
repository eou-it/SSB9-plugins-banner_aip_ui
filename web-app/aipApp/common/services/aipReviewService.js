/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AIPReviewService = /** @class */ (function () {
        function AIPReviewService($http, $q, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
        }
        AIPReviewService.$inject = ["$http", "$q", "APP_PATH"];
        return AIPReviewService;
    }());
    AIP.AIPReviewService = AIPReviewService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
