/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
///<reference path="../../common/services/spinnerService.ts"/>
declare var register;

module AIP {

    interface IReviewActionItemCtrl {
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
    }

    export class ReviewActionItemCtrl implements IReviewActionItemCtrl {

        $inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$filter"];
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
        $uibModal;
        spinnerService;
        $sce;
        $timeout;
        $state;
        $filter;
        $q;
        APP_ROOT;
        actionItemNamesList;
        actionItemDetails;
        personId;
        personName;
        selected;
        option;
        showModal;
        query: IAttachmentListQuery;
        actionItemId;
        responseId;
        selectedRecord;
        gridData;

        constructor($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $filter) {
            $scope.vm = this;
            this.$state = $state;
            this.aipReviewService = AIPReviewService;
            this.userService = AIPUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.APP_ROOT = APP_ROOT;
            this.$sce = $sce;
            this.$filter = $filter;
            this.actionItemNamesList = [];
            this.actionItemDetails = null;
            this.personId;
            this.personName;
            this.selected;
            this.option;
            this.showModal = false;
            this.actionItemId;
            this.responseId;
            this.query;
            this.gridData = {};
            this.init();

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
                title: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.attachmentName"),
                ariaLabel: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.attachmentName"),
                width: "20%",
                options: {
                    sortable: true,
                    visible: true,
                    ascending: true,
                    columnShowHide: false
                }
            }, {
                name: "documentUploadedDate",
                title: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.uploadDate"),
                ariaLabel: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.uploadDate"),
                width: "20%",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: false
                }
            },
                {
                    name: "fileLocation",
                    title: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.location"),
                    ariaLabel: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.location"),
                    width: "20%",
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
            $scope.selectRecord = function (data) {
                $scope.selectedRecord = data;
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
        }

        init() {
            var allPromises = [];
            allPromises.push(
                this.aipReviewService.getActionItem(this.$state.params.userActionItemID)
                    .then((response) => {
                        this.actionItemDetails = response.data;
                        this.actionItemId = this.actionItemDetails.actionItemId;
                        this.responseId = this.actionItemDetails.responseId;
                        this.personId = this.actionItemDetails.spridenId;
                    })
            );

        }

        /**
         * Gets list of attached document for a response.
         * @param query
         */
        fetchData = function (query) {
            query.actionItemId = this.actionItemId;
            query.responseId = this.responseId;
            query.personId = this.personId;
            var deferred = this.$q.defer();
            this.aipReviewService.fetchAttachmentsList(query).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        /**
         * Preview of document.
         * @param row
         */
        previewDocument = function (row) {
            this.spinnerService.showSpinner(true);
            this.aipReviewService.previewDocument(row)
                .then((response: any) => {
                    this.spinnerService.showSpinner(false);
                    if (response.data.success === true) {
                        if (response.data.bdmDocument) {
                            var bdmDocument = response.data.bdmDocument;
                            window.open(bdmDocument.viewURL);
                        } else {
                            var base64Encoded = response.data.documentContent
                            var fileNameSplit = row.documentName.split('.')
                            var fileExtension = fileNameSplit[fileNameSplit.length - 1]

                            switch (fileExtension) {
                                case "pdf":
                                    var pdfWindow = "data:application/pdf;base64," + base64Encoded;
                                    window.open(pdfWindow);
                                    break;
                                case "jpg":
                                    var jpgWindow = "data:image/jpeg;base64," + base64Encoded;
                                    window.open(jpgWindow);
                                    break;
                                case "jpeg":
                                    var jpgWindow = "data:image/jpeg;base64," + base64Encoded;
                                    window.open(jpgWindow);
                                    break;
                                case "png":
                                    var pngWindow = "data:image/png;base64," + base64Encoded;
                                    window.open(pngWindow);
                                    break;
                                case "txt":
                                    var txtWindow = "data:text/plain;base64," + base64Encoded;
                                    window.open(txtWindow);
                                    break;
                                default:
                                    var dataURI = "data:application/octet-stream;base64," + base64Encoded;
                                    var link = document.createElement('a');
                                    document.body.appendChild(link);
                                    link.href = dataURI;
                                    link.download = row.documentName;
                                    link.click();
                            }
                        }
                    }

                });
        };

        /**
         * Show of grid in the model window with list of attachments.
         */
        viewAttachemnts() {
            this.showModal = true;
            this.actionItemId = this.actionItemDetails.actionItemId;
            this.responseId = this.actionItemDetails.responseId;
        }

    }
}

register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
