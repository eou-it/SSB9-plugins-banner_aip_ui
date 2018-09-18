/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
            var url = this.ENDPOINT.admin.actionItemStatusGrid +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemStatus') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0) +
                '&max=' + realMax;
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
        AdminActionStatusService.prototype.saveStatus = function (status) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.statusSave,
                data: status
            });
            return request;
        };
        AdminActionStatusService.prototype.removeStatus = function (status) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.removeStatus,
                data: status
            });
            return request;
        };
        AdminActionStatusService.prototype.getRules = function (actionItemId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.rulesByActionItem + "?actionItemId=" + actionItemId
            });
            return request;
        };
        AdminActionStatusService.prototype.getRuleStatus = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemStatusList
            });
            return request;
        };
        AdminActionStatusService.prototype.getMaxAttachmentsVal = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getMaxAttachmentsVal
            });
            return request;
        };
        AdminActionStatusService.prototype.getActionItemsById = function (PostId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemById + "?postID=" + PostId
            });
            return request;
        };
        AdminActionStatusService.prototype.getProcessedServerDateTimeAndTimezone = function (selectedUserVal) {
            var request = this.$http({
                method: "POST",
                data: selectedUserVal,
                url: this.ENDPOINT.admin.processedDateTime
            });
            return request;
        };
        AdminActionStatusService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminActionStatusService;
    })();
    AIP.AdminActionStatusService = AdminActionStatusService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionStatusService", AIP.AdminActionStatusService);
//# sourceMappingURL=adminActionStatusService.js.map