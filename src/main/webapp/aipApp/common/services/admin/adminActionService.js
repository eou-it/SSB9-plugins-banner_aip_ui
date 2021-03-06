/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
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
        function AdminActionService($http, $q, $resource, GRAILSCONTROLLERS, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
            this.ENDPOINT = ENDPOINT;
            this.$resource = $resource;
            this.GRAILSCONTROLLERS = GRAILSCONTROLLERS;
        }
        AdminActionService.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemList +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
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
        AdminActionService.prototype.fetchTableData = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.ENDPOINT.admin.actionItemPostJobList +
                '?searchParam=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'postingName') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0) +
                '&max=' + realMax;
            url = url + (query.recurringPostId ? '&recurringPostId=' + query.recurringPostId : '');
            var params = {
                filterName: query.searchParam || "%",
                sortColumn: query.sortColumnName || "postingName",
                sortAscending: query.ascending || false,
                max: realMax || "",
                offset: query.offset || 0,
                recurringPostId: query.recurringPostId
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
        AdminActionService.prototype.getPostStatus = function (postID) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.statusPosted + "?postID=" + postID
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminActionService.prototype.getJobDetails = function (postID) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.jobDetailsById + "?postID=" + postID
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
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
        AdminActionService.prototype.getCurrentDateLocale = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.fetchCurrentDateInLocaleFormat
            });
            return request;
        };
        AdminActionService.prototype.getCurrentTimeLocale = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.is12HourClock
            });
            return request;
        };
        AdminActionService.prototype.getCurrentTimeZoneLocale = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.listAvailableTimezones
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
        AdminActionService.prototype.loadBlockingProcessLov1 = function () {
            {
                var request = this.$http({
                    method: "GET",
                    url: this.ENDPOINT.admin.loadBlockingProcessLov
                });
                return request;
            }
        };
        AdminActionService.prototype.deleteStatus = function (status) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.deleteActionItem,
                data: status
            });
            return request;
        };
        AdminActionService.prototype.savePostActionItem = function (postActionItem, selected, modalResult, selectedPopulation, postNow, sendTime, timeZone, regeneratePopulation, displayDatetimeZone) {
            var params = {
                postId: postActionItem.postId,
                postingName: postActionItem.name,
                postingActionItemGroupId: selected.groupId,
                actionItemIds: modalResult,
                populationId: selectedPopulation.id,
                displayStartDate: postActionItem.displayStartDate,
                displayEndDate: postActionItem.displayEndDate,
                postNow: '' + postNow + '',
                scheduled: '' + !postNow + '',
                scheduledStartDate: postActionItem.scheduledStartDate,
                scheduledStartTime: sendTime,
                timezoneStringOffset: timeZone,
                populationRegenerateIndicator: regeneratePopulation,
                displayDatetimeZone: displayDatetimeZone
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: postActionItem.postId ? this.ENDPOINT.admin.updateActionItemPosting : this.ENDPOINT.admin.createPostActionItem
            });
            return request;
        };
        AdminActionService.prototype.saveRecurringActionItem = function (postActionItem, selected, modalResult, selectedPopulation, regeneratePopulation, recurCount, recurFreqeunecy, displayStartDateOffset, recDisplayEndDateType, displayEndDateOffset, recurDisplayEndDate, recurranceStartDate, recurranceEndDate, recurrTime, recurrTimeZone, displayDatetimeZone) {
            var params = { postId: postActionItem.postId,
                postingName: postActionItem.name,
                postingActionItemGroupId: selected.groupId,
                actionItemIds: modalResult,
                populationId: selectedPopulation.id,
                displayStartDate: postActionItem.displayStartDate,
                displayEndDate: postActionItem.displayEndDate,
                populationRegenerateIndicator: regeneratePopulation,
                recurFrequency: recurCount,
                recurFrequencyType: recurFreqeunecy.value,
                postingDispStartDays: displayStartDateOffset,
                postingDispEndDays: recDisplayEndDateType === 'OFFSET' ? displayEndDateOffset : null,
                postingDisplayEndDate: recDisplayEndDateType === 'EXACT' ? recurDisplayEndDate : null,
                recurStartDate: recurranceStartDate,
                recurEndDate: recurranceEndDate,
                recurStartTime: recurrTime,
                displayDatetimeZone: displayDatetimeZone,
                recurPostTimezone: recurrTimeZone
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: postActionItem.postId ? this.ENDPOINT.admin.updateRecurringActionItemPosting : this.ENDPOINT.admin.addRecurringActionItemPosting
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
                actionItemId: actionItem.id
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
        AdminActionService.prototype.updateBlockedProcessItems = function (actionItemId, globalBlockProcess, blockedProcesses) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateBlockedProcessItems,
                data: {
                    actionItemId: actionItemId,
                    globalBlockProcess: globalBlockProcess,
                    blockedProcesses: blockedProcesses
                }
            });
            return request;
        };
        AdminActionService.prototype.fetchRecurringJobPostMetaData = function (recurringPostId) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.recurringActionItemPostMetaData +
                '?recurringPostId=' + recurringPostId;
            var params = {
                recurringPostId: recurringPostId
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
        AdminActionService.$inject = ["$http", "$q", "$resource", "GRAILSCONTROLLERS", "$filter", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
angular.module("bannerAIP").service("AdminActionService", AIP.AdminActionService);
angular.module("bannerAIP").service("dateFormatService", AIP.AdminActionService);
