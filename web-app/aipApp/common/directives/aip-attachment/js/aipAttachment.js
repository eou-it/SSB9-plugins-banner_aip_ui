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
                actionItemId: "="
            };
            this.attachmentParams = {};
            this.$q = $q;
        }
        AIPAttachment.prototype.compile = function () {
        };
        AIPAttachment.prototype.link = function (scope, elem, attr) {
        };
        AIPAttachment.prototype.controller = function ($scope, $q, AIPUploadService) {
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
            $scope.draggableColumnNames = [];
            $scope.mobileConfig = {
                documentName: 3,
                documentUploadedDate: 3,
                attachmentActions: 3
            };
            $scope.searchConfig = {
                id: "dataTableSearch",
                delay: 300,
                ariaLabel: "Search",
                searchString: "",
                placeholder: "Search",
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
            $scope.submitUpload = function (selectedFile) {
                if (selectedFile) {
                    this.attachmentParams = { actionItemId: 218, responseId: 391, documentName: 'testfile', fileLocation: 'AIP', file: selectedFile[0] };
                    //TODO need to work on getting params data
                    AIPUploadService.saveUploadInfo(this.attachmentParams);
                }
            };
        };
        AIPAttachment.$inject = ["$filter", "$q", "AIPUploadService"];
        return AIPAttachment;
    }());
    AIPUI.AIPAttachment = AIPAttachment;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
