/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../services/aipAttchmentService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;


module AIPUI {

    export class AIPAttachment  {
        static $inject = ["$filter", "$q","AIPUploadService"];

        $filter;
        $q: ng.IQService;
        selectedRecord;
        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;
        attachmentParams;
        aipUploadService : AIP.UploadService;
        constructor($filter, $q, AIPUploadService ) {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {
                showModal:"=",
                responseId:"=",
                actionItemId:"="
            };
            this.attachmentParams = {};
            this.$q = $q;
        }

        compile() {

        }

        link(scope, elem, attr) {
        }

        controller($scope,$filter, $q, AIPUploadService) {
            $scope.data = [];
            $scope.paginationConfig = {
                pageLengths: [5, 10, 25, 50, 100],
                offset: 10,
                recordsFoundLabel: "Results found",
                pageTitle: "Go To Page (End)",
                pageLabel: "Page",
                pageAriaLabel: "Go To Page. Short cut is End",
                ofLabel: "of"
            };
            $scope.draggableColumnNames=[];
            $scope.mobileConfig = {
                documentName: 3,
                documentUploadedDate: 3,
                attachmentActions:3
            };
            $scope.searchConfig = {
                            id: "dataTableSearch",
                            delay: 300,
                            ariaLabel: "Search",
                            searchString: "",
                            placeholder : "Search",
                            maxlength: 200,
                            minimumCharacters: 1
                        };
            $scope.header = [{
                            name: "id",
                            title: "ID",
                            width: "0px",
                            options: {
                                sortable: false,
                                visible: false,
                                columnShowHide: false
                            }
                        }, {
                            name: "documentName",
                            title: "Document Name",
                            ariaLabel: "Document Name",
                            width: "50%",
                            options: {
                                sortable: true,
                                visible: true,
                                ascending:true,
                                columnShowHide: false
                            }
                        }, {
                            name: "documentUploadedDate",
                            title: "Uploaded Date",
                            ariaLabel: "Document Uploaded Date",
                            width: "30%",
                            options: {
                                sortable: true,
                                visible: true,
                                columnShowHide: false
                            }
                        },
                        {
                            name: "attachmentActions",
                            title: "Actions",
                            ariaLabel: "Actions",
                            width: "20%",
                            options: {
                                sortable: false,
                                visible: true,
                                columnShowHide: false
                            }
                        }
                        ];
            $scope.selectRecord = function(data) {
                        $scope.selectedRecord = data;
            }
            $scope.fetchData = function(query:AIP.IAttachmentListQuery){
                var deferred = $q.defer();
                query.actionItemId = $scope.actionItemId;
                query.responseId = $scope.responseId;
                AIPUploadService.fetchAttachmentsList(query)
                    .then((response) => {
                        deferred.resolve(response.data);
                    }, (error) => {
                        console.log(error);
                        deferred.reject(error);
                    });
                return deferred.promise;
            }

            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };

            $scope.uploadDocument = function (selectedFiles) {
                if(!selectedFiles){
                    errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                    return;
                }
                var selectedFile = selectedFiles[0];
                if(!selectedFile){
                    errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                    return;
                }

                if(selectedFileValidate(selectedFile)){
                    console.log("$scope.actionItemId"+$scope.actionItemId);
                    this.attachmentParams={
                        actionItemId: $scope.actionItemId,
                        responseId: $scope.responseId,
                        documentName:selectedFile.name,
                        file:selectedFile
                    };
                    console.log("this.attachmentParams"+this.attachmentParams);
                    //TODO need to work on getting params data
                    AIPUploadService.uploadDocument(this.attachmentParams)
                        .then((response:any) => {
                           console.log("response->"+response);
                            if(response.success === true){
                                successNotification(response.message);
                            }else {
                                errorNotification(response.message);
                            }

                        })
                }
            };

            var selectedFileValidate = function (selectedFile) {
                if(maxFileSizeValidate(selectedFile.size) && restrictedFileTypeValidate(selectedFile.type)){
                    return true;
                }
                return false;
            };

            var maxFileSizeValidate = function(selectedFileSize){
                AIPUploadService.maxFileSize(this.attachmentParams)
                    .then((response:any) => {
                        if(response.maxFileSize){
                            if( selectedFileSize > response.maxFileSize){
                                errorNotification($filter("i18n_aip")("js.aip.common.file.maxsize"));
                                return false;
                            }
                        }
                })
                return true
            };

            var restrictedFileTypeValidate = function(selectedFileType){
                AIPUploadService.restrictedFileTypes(this.attachmentParams)
                    .then((response:any) => {
                        if(response.restrictedFileTypes){
                            if(selectedFileType in response.restrictedFileTypes){
                                errorNotification($filter("i18n_aip")("js.aip.common.file.type.restricted"));
                                return false;
                            }
                        }
                    })
                return true;
            };

            var  errorNotification= function(message) {
                var n = new Notification({
                    message: message,
                    type: "error",
                    flash: true
                });
                notifications.addNotification(n);
            }

            var  successNotification= function(message) {
                var n = new Notification({
                    message: message,
                    type: "success",
                    flash: true
                });
                notifications.addNotification(n);
            }

        }

    }
}

register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
