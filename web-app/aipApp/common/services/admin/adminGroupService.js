/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
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
    var AdminGroupService = (function () {
        function AdminGroupService($http, $q, $filter, ENDPOINT, $sce) {
            this.$http = $http;
            this.$q = $q;
            this.$sce = $sce;
            this.$filter = $filter;
            this.ENDPOINT = ENDPOINT;
        }
        AdminGroupService.prototype.getStatus = function () {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.groupStatus
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                //TODO: handle ajax fail in global
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.getFolder = function () {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.folders
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                //TODO: handle ajax fail in global
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.getGroupList = function () {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.groupList
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                //TODO: handle ajax fail in global
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.saveGroup = function (groupInfo, edit, duplicate) {
            var params = {
                group: {
                    groupId: groupInfo.id,
                    groupTitle: groupInfo.title,
                    groupName: groupInfo.name,
                    folderId: groupInfo.folder.id,
                    groupStatus: groupInfo.status,
                    groupDesc: groupInfo.description,
                    version: 0
                },
                edit: edit,
                duplicate: duplicate
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createOrUpdateGroup
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                //TODO: handle ajax fail in global
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.getGroupDetail = function (groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.openGroup + "?groupId=" + groupId
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.enableGroupOpen = function (groupId) {
            //var selectedGroup = groupId;
            $("#openGroupBtn").removeAttr("disabled");
            return groupId;
        };
        AdminGroupService.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.groupList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'groupTitle') +
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
                url: this.ENDPOINT.admin.groupList,
                data: params
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        AdminGroupService.prototype.deleteGroup = function (status) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.deleteGroup,
                data: status
            });
            return request;
        };
        AdminGroupService.prototype.groupPosted = function (groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.groupPosted + "?groupId=" + groupId
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.getAssignedActionItemInGroup = function (groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getAssignedActionItemInGroup + "?groupId=" + groupId
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.getActionItemListForselect = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.listActionItemForSelect
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.updateActionItemGroupAssignment = function (groupAssignment, groupId) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateActionItemGroupAssignment,
                data: { assignment: groupAssignment, groupId: groupId }
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        return AdminGroupService;
    }());
    AdminGroupService.$inject = ["$http", "$q", "$filter", "ENDPOINT", "$sce"];
    AIP.AdminGroupService = AdminGroupService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);
