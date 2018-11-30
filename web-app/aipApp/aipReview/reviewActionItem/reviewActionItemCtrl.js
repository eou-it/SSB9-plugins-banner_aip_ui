/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
///<reference path="../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var ReviewActionItemCtrl = /** @class */ (function () {
        function ReviewActionItemCtrl($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $filter) {
            this.$inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$filter"];
            /**
             * Gets list of attached document for a response.
             * @param query
             */
            this.fetchData = function (query) {
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
            this.previewDocument = function (row) {
                var _this = this;
                this.spinnerService.showSpinner(true);
                this.aipReviewService.previewDocument(row)
                    .then(function (response) {
                    _this.spinnerService.showSpinner(false);
                    if (response.data.success === true) {
                        if (response.data.bdmDocument) {
                            var bdmDocument = response.data.bdmDocument;
                            window.open(bdmDocument.viewURL);
                        }
                        else {
                            var base64Encoded = response.data.documentContent;
                            var fileNameSplit = row.documentName.split('.');
                            var fileExtension = fileNameSplit[fileNameSplit.length - 1];
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
            this.actionItemReviewStatusList = null;
            this.contactInfo;
            this.externalCommetInd = true;
            this.reviewComments;
            this.selectedReviewState = {};
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
            $scope.selectRecord = function (data) {
                $scope.selectedRecord = data;
            };
        }
        ReviewActionItemCtrl.prototype.init = function () {
            var _this = this;
            var allPromises = [];
            allPromises.push(this.aipReviewService.getActionItem(this.$state.params.userActionItemID)
                .then(function (response) {
                _this.actionItemDetails = response.data;
                _this.actionItemId = _this.actionItemDetails.actionItemId;
                _this.responseId = _this.actionItemDetails.responseId;
                _this.personId = _this.actionItemDetails.spridenId;
                _this.selectedReviewState.name = _this.actionItemDetails.reviewState;
            }));
            this.getReviewStatusList();
        };
        /**
         * Show of grid in the model window with list of attachments.
         */
        ReviewActionItemCtrl.prototype.viewAttachments = function () {
            this.showModal = true;
            this.actionItemId = this.actionItemDetails.actionItemId;
            this.responseId = this.actionItemDetails.responseId;
        };
        ReviewActionItemCtrl.prototype.getReviewStatusList = function () {
            var _this = this;
            this.aipReviewService.getReviewStatusList()
                .then(function (response) {
                _this.actionItemReviewStatusList = response;
            });
        };
        ReviewActionItemCtrl.prototype.reset = function (vm) {
            var notification = new Notification({
                message: this.$filter("i18n_aip")("js.aip.review.monitor.reset.prompt.message"),
                type: "warning"
            });
            notification.addPromptAction(this.$filter("i18n_aip")("default.yes.label"), function () {
                notifications.remove(notification);
                vm.updateActionItemReview();
            });
            notification.addPromptAction(this.$filter("i18n_aip")("default.button.cancel.label"), function () {
                notifications.remove(notification);
            });
            notifications.addNotification(notification);
        };
        ReviewActionItemCtrl.prototype.updateActionItemReview = function () {
            var _this = this;
            var reqParams = {
                userActionItemId: this.actionItemDetails.id,
                responseId: this.actionItemDetails.responseId,
                reviewStateId: this.selectedReviewState.code,
                displayEndDate: this.actionItemDetails.displayEndDate,
                externalCommetInd: this.externalCommetInd,
                reviewComments: this.reviewComments,
                contactInfo: this.contactInfo
            };
            this.spinnerService.showSpinner(true);
            this.aipReviewService.updateActionItemReview(reqParams)
                .then(function (response) {
                _this.spinnerService.showSpinner(false);
                if (response.data.success) {
                    _this.displayNotification(response.data.message, "success");
                }
                else {
                    _this.displayNotification(response.data.message, "error");
                }
            });
        };
        ReviewActionItemCtrl.prototype.displayNotification = function (message, errorType) {
            var n = new Notification({
                message: message,
                type: errorType,
                flash: true
            });
            notifications.addNotification(n);
        };
        return ReviewActionItemCtrl;
    }());
    AIP.ReviewActionItemCtrl = ReviewActionItemCtrl;
})(AIP || (AIP = {}));
register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
