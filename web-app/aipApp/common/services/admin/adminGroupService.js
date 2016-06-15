///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
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
                groupStatus: groupInfo.status,
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
        AdminGroupService.$inject = ["$http", "ENDPOINT"];
        return AdminGroupService;
    }());
    AIP.AdminGroupService = AdminGroupService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);
//# sourceMappingURL=adminGroupService.js.map