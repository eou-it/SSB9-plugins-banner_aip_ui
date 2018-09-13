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
        static $inject=["$http", "$q", "APP_PATH"];
        $http:ng.IHttpService;
        $q:ng.IQService;
        APP_PATH;
        constructor($http:ng.IHttpService, $q, APP_PATH) {
            this.$http = $http;
            this.APP_PATH = APP_PATH;
        }
        saveUploadInfo(params) {
            var uploadRequest =  this.$http({
                method: "POST",
                data:params,
                url: this.APP_PATH + "/upload/saveUploadInfo"
            }).then((response:IGetUploaResponse) => {
                return response;
            }, (err) => {
                throw new Error(err);
            });
            return uploadRequest;
        }

        getRestrictedFileTypes() {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/upload/restrictedFileType"
            });
            return request;
        }

        getFileMaxSize(){
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/upload/fileMaxSize"
            });
            return request;
        }
    }
}
register("bannerCommonAIP").service("AIPUploadService", AIP.UploadService);