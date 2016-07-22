///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var UserService = (function () {
        function UserService($http, $q, APP_PATH) {
            this.$http = $http;
            this.APP_PATH = APP_PATH;
        }
        UserService.prototype.getUserInfo = function () {
            var userRequest = this.$http({
                method: "POST",
                url: this.APP_PATH + "/aip/userInfo"
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
    AIP.UserService = UserService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AIPUserService", AIP.UserService);
//# sourceMappingURL=userService.js.map