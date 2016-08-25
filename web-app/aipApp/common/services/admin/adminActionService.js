/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var ActionItemStatus;
    (function (ActionItemStatus) {
        ActionItemStatus[ActionItemStatus["Pending"] = 0] = "Pending";
        ActionItemStatus[ActionItemStatus["Active"] = 1] = "Active";
        ActionItemStatus[ActionItemStatus["Inactive"] = 2] = "Inactive";
    })(ActionItemStatus || (ActionItemStatus = {}));
    var AdminActionService = (function () {
        function AdminActionService($http, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
            this.ENDPOINT = ENDPOINT;
        }
        AdminActionService.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + query.ascending +
                '&offset=' + (query.offset || '') +
                '&max=' + (query.max || '');
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var params = {
                filterName: query.searchString || "%",
                sortColumn: query.sortColumnName || "id",
                sortAscending: query.ascending || false,
                max: realMax || "",
                offset: query.offset || 0
            };
            this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.actionItemList,
                data: params
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        ;
        AdminActionService.prototype.getFolder = function () {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };
        ;
        AdminActionService.prototype.getStatus = function () {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.actionItemStatus
            });
            return request;
        };
        AdminActionService.prototype.saveActionItem = function (actionItem) {
            var params = {
                title: actionItem.title,
                folderId: parseInt(actionItem.folder),
                description: actionItem.description,
                status: ActionItemStatus[actionItem.status]
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        };
        AdminActionService.prototype.getActionItemDetail = function (actionItemId) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.openActionItem,
                data: { actionItemId: actionItemId }
            });
            return request;
        };
        AdminActionService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
//# sourceMappingURL=adminActionService.js.map