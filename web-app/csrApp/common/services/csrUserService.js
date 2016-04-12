///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var UserService = (function () {
        function UserService($http, $q, APP_PATH) {
            this.$http = $http;
            this.APP_PATH = APP_PATH;
        }
        UserService.prototype.getUserInfo = function () {
            var userRequest = this.$http({
                method: "POST",
                url: this.APP_PATH + "/csr/userInfo"
            }).then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return userRequest;
        };
        UserService.$inject = ["$http", "$q", "APP_PATH"];
        return UserService;
    })();
    CSR.UserService = UserService;
})(CSR || (CSR = {}));
register("bannercsr").service("CSRUserService", CSR.UserService);
//# sourceMappingURL=csrUserService.js.map