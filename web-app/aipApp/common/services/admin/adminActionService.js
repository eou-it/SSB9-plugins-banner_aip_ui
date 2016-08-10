/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminActionService = (function () {
        function AdminActionService($http, $q, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.ENDPOINT = ENDPOINT;
        }
        AdminActionService.prototype.getActionLists = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionList
            });
            return request;
        };
        AdminActionService.$inject = ["$http", "$q", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
//# sourceMappingURL=adminActionService.js.map