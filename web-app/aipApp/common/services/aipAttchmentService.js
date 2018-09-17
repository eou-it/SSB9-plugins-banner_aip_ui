/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var UploadService = /** @class */ (function () {
        function UploadService($http, $q, APP_PATH, Upload) {
            this.$http = $http;
            this.$q = $q;
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
        UploadService.prototype.fetchAttachmentsList = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.APP_PATH + "/aipDocumentManagement/listDocuments" +
                '?actionItemId=' + (query.actionItemId || '') +
                '&responseId=' + (query.responseId || '') +
                '&searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + (query.ascending.toString() || "") +
                '&offset=' + (query.offset || 0) +
                '&max=' + realMax;
            this.$http({
                method: "GET",
                url: url
            }).then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
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
    }());
    AIP.UploadService = UploadService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);
