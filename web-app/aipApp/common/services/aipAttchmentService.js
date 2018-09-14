/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var UploadService = (function () {
        function UploadService($http, $q, APP_PATH, Upload) {
            this.$http = $http;
            this.APP_PATH = APP_PATH;
            this.Upload = Upload;
        }
        UploadService.prototype.saveUploadInfo = function (params) {
            console.log("params" + params.actionItemId);
            this.Upload.upload({
                fields: { actionItemId: params.actionItemId, responseId: params.responseId, documentName: params.documentName, fileLocation: params.fileLocation },
                file: params.file,
                url: this.APP_PATH + "/aipDocumentManagement/uploadDocument"
            }).success(function (data, status, headers, config) {
            }).error(function () {
            });
        };
        UploadService.prototype.getRestrictedFileTypes = function () {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/restrictedFileType"
            });
            return request;
        };
        UploadService.prototype.getFileMaxSize = function () {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/fileMaxSize"
            });
            return request;
        };
        UploadService.$inject = ["$http", "$q", "APP_PATH", "Upload"];
        return UploadService;
    })();
    AIP.UploadService = UploadService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);
//# sourceMappingURL=aipAttchmentService.js.map