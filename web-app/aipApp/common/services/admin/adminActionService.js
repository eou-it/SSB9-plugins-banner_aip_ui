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
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
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
        AdminActionService.prototype.getFolder = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };
        ;
        AdminActionService.prototype.getStatus = function () {
            var request = this.$http({
                method: "GET",
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
        AdminActionService.prototype.updateActionItemContent = function (actionItem) {
            var params = {
                actionItemContentId: parseInt(actionItem.actionItemContentId),
                actionItenContent: actionItem.actionItemContent
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.editActionItemContent
            });
            return request;
        };
        AdminActionService.prototype.getActionItemDetail = function (actionItemId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.openActionItem + "?actionItemId=" + actionItemId.toString()
            });
            return request;
        };
        AdminActionService.prototype.getActionItemTemplates = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemTemplateList
            });
            return request;
        };
        AdminActionService.prototype.saveActionItemTemplate = function (templateId, actionItemDetailId) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.saveActionItemTemplate,
                data: {
                    templateId: templateId,
                    actionItemDetailId: actionItemDetailId
                }
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