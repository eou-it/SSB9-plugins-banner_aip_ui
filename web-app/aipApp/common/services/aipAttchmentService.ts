/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module AIP {
    export interface IAttachmentInfo {
        id: number;
        actionItemId: number;
        responseId: number;
        documentName: string;
        documentUploadedDate: Date;
    }

    interface IGetUploaResponse {
        uploadData: IAttachmentInfo;
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
        saveUploadInfo(params) {
            console.log("params"+params.actionItemId);
            this.Upload.upload({
                fields: {actionItemId: params.actionItemId, responseId: params.responseId,documentName:params.documentName,fileLocation:params.fileLocation},
                file: params.file,
                url: this.APP_PATH + "/aipDocumentManagement/uploadDocument"
            }).success(function (data, status, headers, config) {

            }).error(function () {

            });
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

        getRestrictedFileTypes() {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/restrictedFileType"
            });
            return request;
        }

        getFileMaxSize(){
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipDocumentManagement/fileMaxSize"
            });
            return request;
        }
    }
}
register("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);
