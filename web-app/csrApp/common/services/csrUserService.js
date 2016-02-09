///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var UserService = (function () {
        function UserService($http) {
            var _this = this;
            this.$http = $http;
            this.getUserInfo().then(function (response) {
                _this.userInfo = response.data;
            }, (function (err) {
                throw new Error(err);
            }));
        }
        UserService.prototype.getUserInfo = function () {
            var request = this.$http({
                method: "POST",
                url: "csrTest/userInfo"
            });
            return request;
        };
        UserService.$inject = ["$http", "$q"];
        return UserService;
    })();
    CSR.UserService = UserService;
})(CSR || (CSR = {}));
register("bannercsr").service("CSRUserService", CSR.UserService);
//# sourceMappingURL=csrUserService.js.map