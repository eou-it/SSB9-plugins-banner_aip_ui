///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var Status;
    (function (Status) {
        Status[Status["pending"] = 1] = "pending";
        Status[Status["active"] = 2] = "active";
        Status[Status["inactive"] = 3] = "inactive";
    })(Status || (Status = {}));
    var AdminGroupService = (function () {
        function AdminGroupService($http, ENDPOINT) {
            this.$http = $http;
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
                groupStatus: Status[groupInfo.status.id],
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
        AdminGroupService.$inject = ["$http", "ENDPOINT"];
        return AdminGroupService;
    }());
    AIP.AdminGroupService = AdminGroupService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);
//# sourceMappingURL=adminGroupService.js.map