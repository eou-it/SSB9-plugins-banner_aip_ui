///<reference path="../../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
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
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.prototype.getFolder = function () {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.groupFolder
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
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
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.$inject = ["$http", "ENDPOINT"];
        return AdminGroupService;
    })();
    CSR.AdminGroupService = AdminGroupService;
})(CSR || (CSR = {}));
register("bannercsr").service("AdminGroupService", CSR.AdminGroupService);
//# sourceMappingURL=adminGroupService.js.map