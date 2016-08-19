///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var Status;
    (function (Status) {
        Status[Status["Pending"] = 1] = "Pending";
        Status[Status["Active"] = 2] = "Active";
        Status[Status["Inactive"] = 3] = "Inactive";
    })(Status || (Status = {}));
    var AdminGroupService = (function () {
        function AdminGroupService($http, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
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
        AdminGroupService.prototype.saveGroup = function (groupInfo) {
            var params = {
                groupTitle: groupInfo.title,
                folderId: groupInfo.folder,
                groupStatus: Status[groupInfo.status],
                groupDesc: groupInfo.description,
                version: 0
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createGroup
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
                method: "POST",
                url: this.ENDPOINT.admin.openGroup,
                data: { groupId: groupId }
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
        ;
        AdminGroupService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminGroupService;
    }());
    AIP.AdminGroupService = AdminGroupService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);
//# sourceMappingURL=adminGroupService.js.map