/*******************************************************************************
 Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
var AIP;
(function (AIP) {
    var UploadService = /** @class */ (function () {
        function UploadService($http, $q, APP_PATH, Upload) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.Upload = Upload;
        }
        UploadService.prototype.uploadDocument = function (params) {
            var defer = this.$q.defer();
            this.Upload.upload({
                fields: { userActionItemId: params.userActionItemId, responseId: params.responseId, documentName: params.documentName, fileLocation: params.fileLocation },
                file: params.file,
                url: this.APP_PATH + "/aipDocumentManagement/uploadDocument"
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                throw new Error(error);
            });
            return defer.promise;
        };
        UploadService.prototype.fetchAttachmentsList = function (query) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.APP_PATH + "/aipDocumentManagement/listDocuments" +
                '?userActionItemId=' + (query.userActionItemId || '') +
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
        UploadService.prototype.deleteDocument = function (documentId) {
            var data = {
                documentId: documentId
            };
            var request = this.$http({
                method: "POST",
                url: this.APP_PATH + "/aipDocumentManagement/deleteDocument",
                data: data
            });
            return request;
        };
        UploadService.prototype.restrictedFileTypes = function () {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/restrictedFileTypes"
            });
            return request;
        };
        UploadService.prototype.maxFileSize = function () {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/maxFileSize"
            });
            return request;
        };
        UploadService.prototype.previewDocument = function (documentId) {
            var data = {
                documentId: documentId
            };
            var request = this.$http({
                method: "POST",
                url: this.APP_PATH + "/aipDocumentManagement/previewDocument",
                data: data
            });
            return request;
        };
        UploadService.$inject = ["$http", "$q", "APP_PATH", "Upload"];
        return UploadService;
    }());
    AIP.UploadService = UploadService;
})(AIP || (AIP = {}));
angular.module("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);
