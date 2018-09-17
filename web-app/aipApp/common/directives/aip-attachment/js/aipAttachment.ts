/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../services/aipAttchmentService.ts"/>

declare var register;

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

        controller($scope, $q, AIPUploadService) {
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
                            width: "30%",
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
                            width: "30%",
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
                        deferred.resolve(response);
                    }, (error) => {
                        console.log(error);
                        deferred.reject(error);
                    });
                return deferred.promise;
            }

            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };

            $scope.submitUpload = function (selectedFile) {
                if(selectedFile){
                    this.attachmentParams={actionItemId:218,responseId:391,documentName:'testfile',fileLocation:'AIP',file:selectedFile[0]};
                    //TODO need to work on getting params data
                    AIPUploadService.saveUploadInfo(this.attachmentParams);
                }

            };
        }

    }
}

register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
