/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminActionStatusService = (function () {
        function AdminActionStatusService($http, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
            this.ENDPOINT = ENDPOINT;
        }
        AdminActionStatusService.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemStatus + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemStatus') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset.toString() || '') +
                '&max=' + (realMax.toString() || '');
            this.$http({
                method: "GET",
                url: url
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        ;
        /*
        getFolder() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };
        getStatus() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemStatus
            });
            return request;
        }
        */
        AdminActionStatusService.prototype.saveActionItem = function (actionItemStatus) {
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
        };
        AdminActionStatusService.prototype.getActionItemStatusDetail = function (actionItemStatusId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.openActionItemStatus + "?actionItemStatusId=" + actionItemStatusId.toString()
            });
            return request;
        };
        AdminActionStatusService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminActionStatusService;
    }());
    AIP.AdminActionStatusService = AdminActionStatusService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionStatusService", AIP.AdminActionStatusService);
//# sourceMappingURL=adminActionStatusService.js.map