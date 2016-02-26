///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var UserService = (function () {
        function UserService($http) {
            this.$http = $http;
        }
        UserService.prototype.getUserInfo = function () {
            var userRequest = this.$http({
                method: "POST",
                url: "csr/userInfo"
            }).then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return userRequest;
        };
        UserService.$inject = ["$http", "$q"];
        return UserService;
    })();
    CSR.UserService = UserService;
})(CSR || (CSR = {}));
register("bannercsr").service("CSRUserService", CSR.UserService);
//# sourceMappingURL=csrUserService.js.map