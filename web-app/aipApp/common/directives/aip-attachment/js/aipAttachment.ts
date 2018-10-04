/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../services/aipAttchmentService.ts"/>
    ///<reference path="../../../services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;


module AIPUI {

    export class AIPAttachment {
        static $inject = ["$filter", "$q", "AIPUploadService","SpinnerService"];

        $scope;
        $filter;
        $q: ng.IQService;
        selectedRecord;
        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;
        aipUploadService: AIP.UploadService;

        constructor($filter, $q, AIPUploadService, SpinnerService) {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {
                showModal: "=",
                responseId: "=",
                actionItemId: "=",
                maxAttachments: "="
            };
            this.$q = $q;
            this.$filter = $filter;
        }

        compile() {

        }

        link(scope, elem, attr) {
        }

        controller($scope, $q, $filter, AIPUploadService, SpinnerService) {
            $scope.query;
            $scope.gridData = {};
            $scope.records;
            $scope.selectedFiles = null;
            $scope.paginationConfig = {
                pageLengths: [5, 10, 25, 50, 100],
                offset: 10,
                recordsFoundLabel: $filter("i18n_aip")("aip.common.results.found"),
                pageTitle: $filter("i18n_aip")("pagination.page.shortcut.label"),
                pageLabel: $filter("i18n_aip")("pagination.page.label"),
                pageAriaLabel: $filter("i18n_aip")("pagination.page.aria.label"),
                ofLabel: $filter("i18n_aip")("pagination.page.of.label")
            };
            $scope.draggableColumnNames = [];
            $scope.mobileConfig = {
                documentName: 3,
                documentUploadedDate: 3,
                attachmentActions: 3
            };
            $scope.searchConfig = {
                id: "dataTableSearch",
                delay: 300,
                ariaLabel: $filter("i18n_aip")("search.aria.label"),
                searchString: "",
                placeholder: $filter("i18n_aip")("search.label"),
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
                title: $filter("i18n_aip")("js.aip.attachments.grid.header.documentName"),
                ariaLabel: $filter("i18n_aip")("js.aip.attachments.grid.header.documentName"),
                width: "40%",
                options: {
                    sortable: true,
                    visible: true,
                    ascending: true,
                    columnShowHide: false
                }
            }, {
                name: "documentUploadedDate",
                title: $filter("i18n_aip")("js.aip.attachments.grid.header.dateOfAttachment"),
                ariaLabel: $filter("i18n_aip")("js.aip.attachments.grid.header.dateOfAttachment"),
                width: "40%",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: false
                }
            },
                {
                    name: "attachmentActions",
                    title: $filter("i18n_aip")("js.aip.attachments.grid.header.actions"),
                    ariaLabel: $filter("i18n_aip")("js.aip.attachments.grid.header.actions"),
                    width: "20%",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
                    }
                }
            ];

            $scope.selectRecord = function (data) {
                $scope.selectedRecord = data;
            };
            $scope.fetchData = function (query: AIP.IAttachmentListQuery) {

                var deferred = $q.defer();
                query.actionItemId = $scope.actionItemId;
                query.responseId = $scope.responseId;
                $scope.query = query;
                AIPUploadService.fetchAttachmentsList(query)
                    .then((response) => {
                        deferred.resolve(response);
                    }, (error) => {
                        console.log(error);
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            $scope.refreshData = function(){
                AIPUploadService.fetchAttachmentsList($scope.query)
                    .then((response) => {
                        $scope.gridData.row = response.result;
                        var msg = document.querySelector("#dataTableAttachmentsList #msg");
                        if(response.length > 0){
                            msg.textContent = "";
                        }else{
                            msg.textContent = $filter("i18n_aip")("aip.common.no.results.found");
                            msg.classList.add("noDataMsg");
                        }
                    }, (error) => {
                    });
            };

            $scope.reset = function () {
                resetSeletedFileValue();
            };

            $scope.uploadDocument = function (selectedFiles) {

                if (!selectedFiles) {
                    errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                    return false;
                }

                var selectedFile = selectedFiles[0];
                if (!selectedFile) {
                    errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                    return false;
                }

                if(!($scope.gridData.row.length < $scope.maxAttachments)){
                    errorNotification($filter("i18n_aip")("aip.uploadDocument.maximum.attachment.error"));
                    resetSeletedFileValue();
                    return false;
                }

                if(isDuplicateFileName($scope.gridData.row,selectedFile.name)){
                    errorNotification($filter("i18n_aip")("js.aip.uploadDocument.file.duplicate.error"));
                    return false;
                }

                maxFileSizeValidate(selectedFile.size).then(function(resposne){
                    if(resposne === 'true'){
                        restrictedFileTypeValidate((selectedFile.name).split('.').pop()).then(function(resposne){
                            if(resposne === 'true') {
                                SpinnerService.showSpinner(true);
                                var attachmentParams = {
                                    actionItemId: $scope.actionItemId,
                                    responseId: $scope.responseId,
                                    documentName: selectedFile.name,
                                    file: selectedFile
                                };

                                AIPUploadService.uploadDocument(attachmentParams)
                                    .then((response:any) => {
                                        SpinnerService.showSpinner(false);
                                        if (response.success === true) {
                                            successNotification(response.message);
                                            $scope.refreshData();
                                            resetSeletedFileValue();
                                        } else {
                                            errorNotification(response.message);
                                        }
                                    })
                            }
                        })
                    }
                })
            };

            var deleteFile = function (documentId) {
                AIPUploadService.deleteDocument(documentId)
                    .then((response: any) => {
                        SpinnerService.showSpinner(false);
                        if (response.data.success === true) {
                            successNotification(response.data.message);
                            $scope.refreshData();
                        } else {
                            errorNotification(response.data.message);
                        }

                    });
            };

            $scope.deleteDocument = function () {
                var data = this.row;
                var n = new Notification({
                    message: $filter("i18n_aip")("js.aip.attachments.delete.prompt.message"),
                    type: "warning"
                });
                n.addPromptAction($filter("i18n_aip")("aip.common.text.no"), function () {
                    notifications.remove(n);

                });
                n.addPromptAction($filter("i18n_aip")("aip.common.text.yes"), function () {
                    SpinnerService.showSpinner(true);
                    deleteFile(data.id);
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            };

            var errorNotification = function (message) {
                var n = new Notification({
                    message: message,
                    type: "error",
                    flash: true
                });
                notifications.addNotification(n);
            }

            var successNotification = function (message) {
                var n = new Notification({
                    message: message,
                    type: "success",
                    flash: true
                });
                notifications.addNotification(n);
            }

            var resetSeletedFileValue = function(){
                $("#fileupload_label").val(null);
            }

            var isDuplicateFileName = function(documentsJson,selectedDocumentName){
                if(documentsJson) {
                    var result = documentsJson.filter(function (documentObj) {
                        return (documentObj.documentName === selectedDocumentName)
                    });
                    return (result.length > 0);
                }
                return false;
            }

            var restrictedFileTypeValidate = function(selectedFileType){
                var deferred = $q.defer();
                AIPUploadService.restrictedFileTypes()
                    .then((response:any) => {
                        if(response.data.restrictedFileTypes){
                            if(response.data.restrictedFileTypes.indexOf(selectedFileType) !== -1){
                                SpinnerService.showSpinner(false);
                                errorNotification($filter("i18n_aip")("aip.uploadDocument.file.type.restricted.error"));
                                deferred.resolve('false');
                            }else{
                                deferred.resolve('true');
                            }
                        }else{
                            deferred.resolve('true');
                        }
                    })
                return deferred.promise
            }

            var maxFileSizeValidate = function(selectedFileSize){
                var deferred = $q.defer();
                AIPUploadService.maxFileSize()
                    .then((response:any) => {
                        if(response.data.maxFileSize){
                            if( selectedFileSize > parseInt(response.data.maxFileSize)){
                                errorNotification($filter("i18n_aip")("aip.uploadDocument.file.maxsize.error"));
                                SpinnerService.showSpinner(false);
                                deferred.resolve('false');
                            }else{
                                deferred.resolve('true');
                            }
                        }else {
                            deferred.resolve('true');
                        }
                    })
                return deferred.promise;
            };

        }

    }
}

register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
