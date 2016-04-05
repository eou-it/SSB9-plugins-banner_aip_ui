///<reference path="../../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var AdminGroupService = (function () {
        function AdminGroupService($http) {
            this.$http = $http;
        }
        AdminGroupService.prototype.getStatus = function () {
            var request = this.$http({
                method: "POST",
                url: "csr/adminGroupStatus"
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
                url: "csr/adminGroupFolder"
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        AdminGroupService.$inject = ["$http"];
        return AdminGroupService;
    })();
    CSR.AdminGroupService = AdminGroupService;
})(CSR || (CSR = {}));
register("bannercsr").service("AdminGroupService", CSR.AdminGroupService);
//# sourceMappingURL=adminGroupService.js.map