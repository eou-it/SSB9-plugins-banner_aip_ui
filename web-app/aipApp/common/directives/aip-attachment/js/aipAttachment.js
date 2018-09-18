/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../services/aipAttchmentService.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPAttachment = /** @class */ (function () {
        function AIPAttachment($filter, $q, AIPUploadService) {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {
                showModal: "=",
                responseId: "=",
                actionItemId: "=",
                maxAttachments: "="
            };
            this.attachmentParams = {};
            this.$q = $q;
            this.$filter = $filter;
        }
        AIPAttachment.prototype.compile = function () {
        };
        AIPAttachment.prototype.link = function (scope, elem, attr) {
        };
        AIPAttachment.prototype.controller = function ($scope, $q, $filter, AIPUploadService) {
            $scope.gridData = {};
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
                    title: "Document Name",
                    ariaLabel: "Document Name",
                    width: "30%",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
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
                    width: "30%",
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
                query.actionItemId = $scope.actionItemId;
                query.responseId = $scope.responseId;
                AIPUploadService.fetchAttachmentsList(query)
                    .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };
            $scope.uploadDocument = function (selectedFiles) {
                if (!selectedFiles) {
                    errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                    return;
                }
                var selectedFile = selectedFiles[0];
                if (!selectedFile) {
                    errorNotification($filter("i18n_aip")("js.aip.common.file.not.selected"));
                    return;
                }
                if (selectedFileValidate(selectedFile)) {
                    console.log("$scope.actionItemId" + $scope.actionItemId);
                    this.attachmentParams = {
                        actionItemId: $scope.actionItemId,
                        responseId: $scope.responseId,
                        documentName: selectedFile.name,
                        file: selectedFile
                    };
                    console.log("this.attachmentParams" + this.attachmentParams);
                    //TODO need to work on getting params data
                    AIPUploadService.uploadDocument(this.attachmentParams)
                        .then(function (response) {
                        console.log("response->" + response);
                        if (response.success === true) {
                            $scope.refreshData(true);
                            successNotification(response.message);
                        }
                        else {
                            errorNotification(response.message);
                        }
                    });
                }
            };
            var selectedFileValidate = function (selectedFile) {
                if (maxFileSizeValidate(selectedFile.size) && restrictedFileTypeValidate(selectedFile.type)) {
                    return true;
                }
                return false;
            };
            var maxFileSizeValidate = function (selectedFileSize) {
                AIPUploadService.maxFileSize(this.attachmentParams)
                    .then(function (response) {
                    if (response.maxFileSize) {
                        if (selectedFileSize > response.maxFileSize) {
                            errorNotification($filter("i18n_aip")("js.aip.common.file.maxsize"));
                            return false;
                        }
                    }
                });
                return true;
            };
            $scope.deleteDocument = function () {
                var data = this.row;
                AIPUploadService.deleteDocument(data.id)
                    .then(function (response) {
                    console.log("response->" + response);
                    if (response.data.success === true) {
                        successNotification(response.data.message);
                        $scope.refreshGrid(true);
                    }
                    else {
                        errorNotification(response.data.message);
                    }
                });
                return true;
            };
            var restrictedFileTypeValidate = function (selectedFileType) {
                AIPUploadService.restrictedFileTypes(this.attachmentParams)
                    .then(function (response) {
                    if (response.restrictedFileTypes) {
                        if (selectedFileType in response.restrictedFileTypes) {
                            errorNotification($filter("i18n_aip")("js.aip.common.file.type.restricted"));
                            return false;
                        }
                    }
                });
                return true;
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
        };
        AIPAttachment.$inject = ["$filter", "$q", "AIPUploadService"];
        return AIPAttachment;
    }());
    AIPUI.AIPAttachment = AIPAttachment;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
