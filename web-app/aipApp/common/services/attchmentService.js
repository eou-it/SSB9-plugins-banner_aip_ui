/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var UploadService = (function () {
        function UploadService($http, $q, APP_PATH) {
            this.$http = $http;
            this.APP_PATH = APP_PATH;
        }
        UploadService.prototype.saveUploadInfo = function (params) {
            var uploadRequest = this.$http({
                method: "POST",
                data: params,
                url: this.APP_PATH + "/upload/saveUploadInfo"
            }).then(function (response) {
                return response;
            }, function (err) {
                throw new Error(err);
            });
            return uploadRequest;
        };
        UploadService.prototype.getRestrictedFileTypes = function () {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/upload/restrictedFileType"
            });
            return request;
        };
        UploadService.prototype.getFileMaxSize = function () {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/upload/fileMaxSize"
            });
            return request;
        };
        UploadService.$inject = ["$http", "$q", "APP_PATH"];
        return UploadService;
    })();
    AIP.UploadService = UploadService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);
//# sourceMappingURL=attchmentService.js.map