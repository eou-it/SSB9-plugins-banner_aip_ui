/*******************************************************************************
 Copyright 2019 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../services/aipAttachmentService.ts"/>
///<reference path="../../../services/spinnerService.ts"/>
var AIPUI;
(function (AIPUI) {
    function AIPAttachment($filter, $q, AIPUploadService, SpinnerService) {
        return {
            restrict: "AE",
            replace: false,
            scope: {
                showModal: "=",
                responseId: "=",
                userActionItemId: "=",
                maxAttachments: "=",
                responseLocked: "="
            },
            $q: $q,
            $filter: $filter,
            AIPUploadService: AIPUploadService,
            SpinnerService: SpinnerService,
            compile: function () {
            },
            link: function (scope, elem, attr) {
            },
            controller: function ($scope, $q, $filter, AIPUploadService, SpinnerService) {
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
                $scope.fetchData = function (query) {
                    var deferred = $q.defer();
                    query.userActionItemId = $scope.userActionItemId;
                    query.responseId = $scope.responseId;
                    $scope.query = query;
                    AIPUploadService.fetchAttachmentsList(query)
                        .then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        console.log(error);
                        deferred.reject(error);
                    });
                    return deferred.promise;
                };
                $scope.refreshData = function () {
                    AIPUploadService.fetchAttachmentsList($scope.query)
                        .then(function (response) {
                        $scope.gridData.row = response.result;
                        var msg = document.querySelector("#dataTableAttachmentsList #msg");
                        if (response.length > 0) {
                            msg.textContent = "";
                        }
                        else {
                            msg.textContent = $filter("i18n_aip")("aip.common.no.results.found");
                            msg.classList.add("noDataMsg");
                        }
                    }, function (error) {
                    });
                };
                $scope.reset = function () {
                    resetSeletedFileValue();
                };
                $scope.uploadDocument = function (selectedFiles) {
                    angular.element("#uploadBtn").attr("disabled", true);
                    if ($("#fileupload_label").val() === "") {
                        selectedFiles = null;
                    }
                    if (!selectedFiles) {
                        errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                        angular.element("#uploadBtn").attr("disabled", false);
                        return false;
                    }
                    var selectedFile = selectedFiles[0];
                    if (!selectedFile) {
                        errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                        angular.element("#uploadBtn").attr("disabled", false);
                        return false;
                    }
                    if (selectedFile && selectedFile.name.length > 60) {
                        errorNotification($filter("i18n_aip")("aip.uploadDocument.file.name.length.error"));
                        angular.element("#uploadBtn").attr("disabled", false);
                        return false;
                    }
                    if (!($scope.gridData.row.length < $scope.maxAttachments)) {
                        errorNotification($filter("i18n_aip")("aip.uploadDocument.maximum.attachment.error"));
                        resetSeletedFileValue();
                        angular.element("#uploadBtn").attr("disabled", false);
                        return false;
                    }
                    if (isDuplicateFileName($scope.gridData.row, selectedFile.name)) {
                        errorNotification($filter("i18n_aip")("js.aip.uploadDocument.file.duplicate.error"));
                        angular.element("#uploadBtn").attr("disabled", false);
                        return false;
                    }
                    maxFileSizeValidate(selectedFile.size).then(function (response) {
                        if (response === 'true') {
                            restrictedFileTypeValidate((selectedFile.name).split('.').pop()).then(function (response) {
                                if (response === 'true') {
                                    SpinnerService.showSpinner(true);
                                    var attachmentParams = {
                                        userActionItemId: $scope.userActionItemId,
                                        responseId: $scope.responseId,
                                        documentName: selectedFile.name,
                                        file: selectedFile
                                    };
                                    AIPUploadService.uploadDocument(attachmentParams)
                                        .then(function (response) {
                                        SpinnerService.showSpinner(false);
                                        if (response.success === true) {
                                            successNotification(response.message);
                                            $scope.refreshData();
                                            resetSeletedFileValue();
                                            triggerChangeInResponse();
                                            angular.element("#uploadBtn").attr("disabled", false);
                                        }
                                        else {
                                            errorNotification(response.message);
                                            angular.element("#uploadBtn").attr("disabled", false);
                                        }
                                    });
                                }
                            });
                        }
                    });
                };
                //Trigger change in response on file upload or delete.
                var triggerChangeInResponse = function () {
                    var selectedResponse = $("input[id^='pbid-ActionItemStatusAgree-radio']:checked");
                    $("input[id^='pbid-ActionItemStatusAgree-radio']").click();
                    selectedResponse.click();
                };
                $scope.previewDocument = function () {
                    SpinnerService.showSpinner(true);
                    var data = this.row;
                    AIPUploadService.previewDocument(data.id)
                        .then(function (response) {
                        SpinnerService.showSpinner(false);
                        if (response.data.success === true) {
                            if (response.data.bdmDocument) {
                                var bdmDocument = response.data.bdmDocument;
                                window.open(bdmDocument.viewURL);
                            }
                            else {
                                var base64Encoded = response.data.documentContent;
                                var fileNameSplit = data.documentName.split('.');
                                var fileExtension = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
                                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                    var byteCharacters = atob(base64Encoded);
                                    var byteNumbers = new Array(byteCharacters.length);
                                    for (var i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    var byteArray = new Uint8Array(byteNumbers);
                                    var blob = new Blob([byteArray], { type: 'application/pdf' });
                                    window.navigator.msSaveOrOpenBlob(blob, data.documentName);
                                    return;
                                }
                                //Other Browsers
                                switch (fileExtension) {
                                    case "pdf":
                                        var contentType = 'application/pdf';
                                        var blob = $scope.b64toBlob(base64Encoded, contentType);
                                        var blobUrl = URL.createObjectURL(blob);
                                        window.open(blobUrl);
                                        break;
                                    case "jpg":
                                        var contentType = 'image/jpeg';
                                        var blob = $scope.b64toBlob(base64Encoded, contentType);
                                        var blobUrl = URL.createObjectURL(blob);
                                        window.open(blobUrl);
                                        break;
                                    case "jpeg":
                                        var contentType = 'image/jpeg';
                                        var blob = $scope.b64toBlob(base64Encoded, contentType);
                                        var blobUrl = URL.createObjectURL(blob);
                                        window.open(blobUrl);
                                        break;
                                    case "png":
                                        var contentType = 'image/png';
                                        var blob = $scope.b64toBlob(base64Encoded, contentType);
                                        var blobUrl = URL.createObjectURL(blob);
                                        window.open(blobUrl);
                                        break;
                                    case "txt":
                                        var contentType = 'text/plain';
                                        var blob = $scope.b64toBlob(base64Encoded, contentType);
                                        var blobUrl = URL.createObjectURL(blob);
                                        window.open(blobUrl);
                                        break;
                                    default:
                                        var contentType = 'application/octet-stream';
                                        var blob = $scope.b64toBlob(base64Encoded, contentType);
                                        var blobUrl = URL.createObjectURL(blob);
                                        var link = document.createElement('a');
                                        document.body.appendChild(link);
                                        link.href = blobUrl;
                                        link.download = data.documentName;
                                        link.click();
                                }
                            }
                        }
                        else {
                            errorNotification(response.data.message);
                        }
                    });
                };
                /*Convert base64 to blob*/
                $scope.b64toBlob = function (b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;
                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];
                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);
                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }
                        var byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }
                    var blob = new Blob(byteArrays, { type: contentType });
                    return blob;
                };
                var deleteFile = function (documentId) {
                    AIPUploadService.deleteDocument(documentId)
                        .then(function (response) {
                        SpinnerService.showSpinner(false);
                        if (response.data.success === true) {
                            successNotification(response.data.message);
                            $scope.refreshData();
                            triggerChangeInResponse();
                        }
                        else {
                            errorNotification(response.data.message);
                        }
                    });
                };
                $scope.deleteDocument = function () {
                    var data = this.row;
                    angular.element($('#attachmentsDiv')).css("pointer-events", "none");
                    var n = new Notification({
                        message: $filter("i18n_aip")("js.aip.attachments.delete.prompt.message"),
                        type: "warning"
                    });
                    n.addPromptAction($filter("i18n_aip")("aip.common.text.no"), function () {
                        notifications.remove(n);
                        angular.element($('#attachmentsDiv')).css("pointer-events", "auto");
                    });
                    n.addPromptAction($filter("i18n_aip")("aip.common.text.yes"), function () {
                        SpinnerService.showSpinner(true);
                        deleteFile(data.id);
                        notifications.remove(n);
                        angular.element($('#attachmentsDiv')).css("pointer-events", "auto");
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
                };
                var successNotification = function (message) {
                    var n = new Notification({
                        message: message,
                        type: "success",
                        flash: true
                    });
                    notifications.addNotification(n);
                };
                var resetSeletedFileValue = function () {
                    $("#fileupload_label").val(null);
                };
                var isDuplicateFileName = function (documentsJson, selectedDocumentName) {
                    if (documentsJson) {
                        var result = documentsJson.filter(function (documentObj) {
                            return (documentObj.documentName === selectedDocumentName);
                        });
                        return (result.length > 0);
                    }
                    return false;
                };
                var restrictedFileTypeValidate = function (selectedFileType) {
                    var deferred = $q.defer();
                    AIPUploadService.restrictedFileTypes()
                        .then(function (response) {
                        if (response.data.restrictedFileTypes) {
                            if ((((response.data.restrictedFileTypes).toUpperCase()).indexOf(selectedFileType.toUpperCase())) !== -1) {
                                SpinnerService.showSpinner(false);
                                errorNotification($filter("i18n_aip")("aip.uploadDocument.file.type.restricted.error"));
                                angular.element("#uploadBtn").attr("disabled", false);
                                deferred.resolve('false');
                            }
                            else {
                                deferred.resolve('true');
                            }
                        }
                        else {
                            deferred.resolve('true');
                        }
                    });
                    return deferred.promise;
                };
                var maxFileSizeValidate = function (selectedFileSize) {
                    var deferred = $q.defer();
                    AIPUploadService.maxFileSize()
                        .then(function (response) {
                        if (response.data.maxFileSize) {
                            if (selectedFileSize > parseInt(response.data.maxFileSize)) {
                                errorNotification($filter("i18n_aip")("aip.uploadDocument.file.maxsize.error"));
                                angular.element("#uploadBtn").attr("disabled", false);
                                SpinnerService.showSpinner(false);
                                deferred.resolve('false');
                            }
                            else {
                                deferred.resolve('true');
                            }
                        }
                        else {
                            deferred.resolve('true');
                        }
                    });
                    return deferred.promise;
                };
            }
        };
    }
    AIPUI.AIPAttachment = AIPAttachment;
    angular.module('bannerAIPUI').directive('aipAttachment', ['$filter', '$q', 'AIPUploadService', 'SpinnerService', AIPAttachment]);
})(AIPUI || (AIPUI = {}));
(function (AIPUI) {
    function SpaceClick() {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                var element = $(elem);
                var SPACE_KEY = 32;
                element.on('keydown', function (e) {
                    if (e.keyCode == SPACE_KEY) {
                        element.click();
                    }
                });
            }
        };
    }
    AIPUI.SpaceClick = SpaceClick;
    angular.module('bannerAIPUI').directive('spaceClick', ['$filter', SpaceClick]);
})(AIPUI || (AIPUI = {}));
