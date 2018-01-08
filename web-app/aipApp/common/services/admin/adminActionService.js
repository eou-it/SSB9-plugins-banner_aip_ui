/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var Status;
    (function (Status) {
        Status[Status["Draft"] = 1] = "Draft";
        Status[Status["Active"] = 2] = "Active";
        Status[Status["Inactive"] = 3] = "Inactive";
    })(Status || (Status = {}));
    var AdminActionService = /** @class */ (function () {
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
        AdminActionService.prototype.fetchTableData = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemPostJobList +
                '?searchParam=' + (query.searchString || '') +
                '&offset=' + (query.offset.toString() || '') +
                '&max=' + (realMax.toString() || '');
            var params = {
                filterName: query.searchParam || "%",
                sortColumn: query.sortColumnName || "id",
                sortAscending: query.ascending || false,
                max: realMax || "",
                offset: query.offset || 0
            };
            this.$http({
                method: "GET",
                url: url,
                data: params
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
        AdminActionService.prototype.getGrouplist = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getGroupLov
            });
            return request;
        };
        AdminActionService.prototype.getGroupActionItem = function (groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getActionGroupActionItemLov + "?searchParam=" + groupId
            });
            return request;
        };
        AdminActionService.prototype.getPopulationlist = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.populationListForSendLov
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
        AdminActionService.prototype.deleteStatus = function (status) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.deleteActionItem,
                data: status
            });
            return request;
        };
        AdminActionService.prototype.savePostActionItem = function (postActionItem, selected, modalResult, selectedPopulation, postNow, regeneratePopulation) {
            var params = {
                postingName: postActionItem.name,
                postingActionItemGroupId: selected.groupId,
                actionItemIds: modalResult,
                populationId: selectedPopulation.id,
                displayStartDate: postActionItem.startDate,
                displayEndDate: postActionItem.endDate,
                postNow: '' + postNow + '',
                populationRegenerateIndicator: regeneratePopulation
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createPostActionItem
            });
            return request;
        };
        AdminActionService.prototype.saveActionItem = function (actionItem) {
            var params = {
                title: actionItem.title,
                name: actionItem.name,
                folderId: parseInt(actionItem.folder.id),
                description: actionItem.description,
                status: actionItem.status,
                actionItemId: actionItem.id
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createActionItem
            });
            return request;
        };
        AdminActionService.prototype.checkActionItemPosted = function (actionItemId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.checkActionItemPosted + "?actionItemId=" + actionItemId
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminActionService.prototype.editActionItems = function (actionItem) {
            var params = {
                title: actionItem.title,
                name: actionItem.name,
                folderId: parseInt(actionItem.folder.id),
                description: actionItem.description,
                status: actionItem.status,
                actionItemId: actionItem.id,
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.editActionItem
            });
            return request;
        };
        AdminActionService.prototype.getActionItemDetail = function (actionItemId) {
            var params = {
                actionItemId: actionItemId
            };
            var request = this.$http({
                method: "GET",
                data: params,
                url: this.ENDPOINT.admin.openActionItem + "?actionItemId=" + actionItemId
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
        AdminActionService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
register("bannerAIP").service("dateFormatService", AIP.AdminActionService);
