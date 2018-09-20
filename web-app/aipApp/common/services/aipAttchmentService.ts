/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module AIP {
    interface IGetUploaResponse {
        success:boolean;
        message:string;
    }
    export interface IAttachmentListQuery {
            responseId: number;
            actionItemId: number;
            searchString: string;
            sortColumnName: string;
            ascending: string;
            offset: string;
            max: string;
    }
    interface IUploadService {
        fetchAttachmentsList(query:IAttachmentListQuery):ng.IPromise<{}>;
    }

    export class UploadService implements IUploadService{
        static $inject=["$http", "$q", "APP_PATH","Upload"];
        $http:ng.IHttpService;
        $q:ng.IQService;
        APP_PATH;
        Upload;
        constructor($http:ng.IHttpService, $q, APP_PATH,Upload) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.Upload = Upload;
        }
        uploadDocument(params) {
            var defer = this.$q.defer();
            this.Upload.upload({
                fields: {actionItemId: params.actionItemId, responseId: params.responseId,documentName:params.documentName,fileLocation:params.fileLocation},
                file: params.file,
                url: this.APP_PATH + "/aipDocumentManagement/uploadDocument"
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                throw new Error(error);
            });
            return defer.promise;
        }
        fetchAttachmentsList (query:IAttachmentListQuery) {
            var deferred = this.$q.defer();
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var url = this.APP_PATH + "/aipDocumentManagement/listDocuments"+
                '?actionItemId=' + (query.actionItemId || '')+
                '&responseId=' + (query.responseId || '') +
                '&searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'actionItemName') +
                '&ascending=' + (query.ascending.toString() || "")+
                '&offset=' + (query.offset || 0 )+
                '&max=' + realMax;
            this.$http({
                method: "GET",
                url: url
            }).then(function(response){
                deferred.resolve(response.data);
            }, function(response){
                deferred.reject(response);
            });
            return deferred.promise;
        }

        restrictedFileTypes() {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/getRestrictedFileTypes"
            });
            return request;
        }

        maxFileSize(){
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/getMaxFileSize"
            });
            return request;
        }
        deleteDocument(documentId){
            var data = {
                documentId:documentId
            };
            var request = this.$http({
                method: "POST",
                url: this.APP_PATH + "/aipDocumentManagement/deleteDocument",
                data:data
            });
            return request;
        }
    }
}
register("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);
