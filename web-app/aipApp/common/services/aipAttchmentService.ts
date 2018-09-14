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
    interface IUploadService {

    }

    export class UploadService implements IUploadService{
        static $inject=["$http", "$q", "APP_PATH","Upload"];
        $http:ng.IHttpService;
        $q:ng.IQService;
        APP_PATH;
        Upload;
        constructor($http:ng.IHttpService, $q, APP_PATH,Upload) {
            this.$http = $http;
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
               console.log("data->"+data);
               console.log("status->"+status);
            }).error(function () {

            });
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