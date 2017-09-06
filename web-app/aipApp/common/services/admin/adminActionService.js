/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var Status;
    (function (Status) {
        Status[Status["Draft"] = 1] = "Draft";
        Status[Status["Active"] = 2] = "Active";
        Status[Status["Inactive"] = 3] = "Inactive";
    })(Status || (Status = {}));
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
            var url = this.ENDPOINT.admin.actionItemList +
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
        AdminActionService.prototype.getFolder = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.folders
            });
            return request;
        };
        AdminActionService.prototype.getStatus = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.adminActionItemStatus
            });
            return request;
        };
        AdminActionService.prototype.getBlockedProcess = function (actionItemId) {
            var url = actionItemId ? this.ENDPOINT.admin.blockedProcessList + "?actionItemId=" + actionItemId :
                this.ENDPOINT.admin.blockedProcessList;
            var request = this.$http({
                method: "GET",
                url: url
            });
            return request;
        };
        AdminActionService.prototype.saveActionItem = function (actionItem) {
            var params = {
                title: actionItem.title,
                folderId: parseInt(actionItem.folder.id),
                description: actionItem.description,
                status: Status[actionItem.status.id],
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
                actionItemContent: actionItem.actionItemContent,
                templateId: parseInt(actionItem.templateId)
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
        AdminActionService.prototype.getActionItemBlocks = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionItemTemplateList
            });
            return request;
        };
        AdminActionService.prototype.saveActionItemTemplate = function (templateId, actionItemId, actionItemContent) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.saveActionItemTemplate,
                data: {
                    templateId: templateId,
                    actionItemId: actionItemId,
                    actionItemContent: actionItemContent
                }
            });
            return request;
        };
        AdminActionService.prototype.updateActionItemStatusRule = function (rules, actionItemId) {
            console.log(rules);
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateActionItemStatusRule,
                data: {
                    rules: rules,
                    actionItemId: actionItemId
                }
            });
            return request;
        };
        AdminActionService.prototype.updateActionItemDetailsAndStatusRules = function (templateId, actionItemId, actionItemContent, rules) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateActionItemStatusRule,
                data: {
                    templateId: templateId,
                    actionItemId: actionItemId,
                    actionItemContent: actionItemContent,
                    rules: rules
                }
            });
            return request;
        };
        AdminActionService.prototype.updateBlockedProcessItems = function (actionItemId, blockItems) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateBlockedProcessItems,
                data: {
                    actionItemId: actionItemId,
                    blockItems: blockItems
                }
            });
            return request;
        };
        return AdminActionService;
    }());
    AdminActionService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
