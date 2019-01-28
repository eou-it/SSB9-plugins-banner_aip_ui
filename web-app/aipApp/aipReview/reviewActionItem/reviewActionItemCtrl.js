/*********************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
///<reference path="../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var ReviewActionItemCtrl = (function () {
        function ReviewActionItemCtrl($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $filter) {
            this.$inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$filter", "datePicker"];
            /**
             * Gets list of attached document for a response.
             * @param query
             */
            this.fetchData = function (query) {
                query.userActionItemId = this.userActionItemId;
                query.responseId = this.responseId;
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
            this.contactInformationList = [];
            this.actionItemDetails = null;
            this.personId;
            this.personName;
            this.selected;
            this.option;
            this.showModal = false;
            this.actionItemId;
            this.responseId;
            this.query;
            this.userActionItemId;
            this.gridData = {};
            this.init();
            this.actionItemReviewStatusList = null;
            this.selectedContact = {};
            this.externalCommentInd = true;
            this.reviewComments;
            this.selectedReviewState = {};
            this.dirtyFlag = false;
            this.actionItemDetailsClone = null;
            this.selectNone = $filter("i18n_aip")("js.aip.action.selected.name");
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
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            allPromises.push(this.aipReviewService.getActionItem(this.$state.params.userActionItemID)
                .then(function (response) {
                _this.actionItemDetails = response.data;
                _this.actionItemDetailsClone = jQuery.extend({}, response.data);
                _this.userActionItemId = _this.actionItemDetails.id;
                _this.responseId = _this.actionItemDetails.responseId;
                _this.selectedReviewState = _this.actionItemDetails.reviewStateObject;
                if (_this.actionItemDetails.reviewAuditObject) {
                    _this.selectedContact.name = (_this.actionItemDetails.reviewAuditObject.contactInfo === "undefined") ? _this.selectNone : _this.actionItemDetails.reviewAuditObject.contactInfo;
                    _this.externalCommentInd = _this.actionItemDetails.reviewAuditObject.externalCommentInd;
                    _this.reviewComments = _this.actionItemDetails.reviewAuditObject.reviewComments;
                }
            }), this.aipReviewService.getContactInformation()
                .then(function (response) {
                _this.contactInformationList = response.data;
                var selectObject = {
                    "name": _this.selectNone,
                    "type": "string",
                    "value": _this.selectNone
                };
                _this.contactInformationList.unshift(selectObject);
            }), this.aipReviewService.getReviewStatusList()
                .then(function (response) {
                _this.actionItemReviewStatusList = response;
                if (_this.actionItemReviewStatusList.length == 0) {
                    _this.displayNotification(_this.$filter("i18n_aip")("aip.review.status.text.unavailable"), "error");
                }
            }));
            this.$q.all(allPromises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
        /**
         * Show of grid in the model window with list of attachments.
         */
        ReviewActionItemCtrl.prototype.viewAttachments = function () {
            this.showModal = true;
            this.userActionItemId = this.actionItemDetails.id;
            this.responseId = this.actionItemDetails.responseId;
        };
        ReviewActionItemCtrl.prototype.reset = function (vm) {
            var notification = new Notification({
                message: this.$filter("i18n_aip")("js.aip.review.monitor.reset.prompt.message"),
                type: "warning"
            });
            notification.addPromptAction(this.$filter("i18n_aip")("default.yes.label"), function () {
                notifications.remove(notification);
                vm.resetValues();
            });
            notification.addPromptAction(this.$filter("i18n_aip")("default.button.cancel.label"), function () {
                notifications.remove(notification);
            });
            notifications.addNotification(notification);
        };
        ReviewActionItemCtrl.prototype.updateActionItemReview = function () {
            var _this = this;
            if (!this.reviewStateValidation(this.selectedReviewState.code)) {
                this.displayNotification(this.$filter("i18n_aip")("aip.review.action.update.review.state.error"), "error");
                return;
            }
            if (!this.isAnyFieldModified()) {
                this.displayNotification(this.$filter("i18n_aip")("aip.review.action.update.review.fields.validation.error"), "error");
                return;
            }
            var reqParams = {
                userActionItemId: this.actionItemDetails.id,
                responseId: this.actionItemDetails.responseId,
                reviewStateCode: this.selectedReviewState.code,
                displayEndDate: this.actionItemDetails.displayEndDate,
                externalCommentInd: this.externalCommentInd,
                reviewComments: this.reviewComments,
                contactInfo: encodeURIComponent(this.selectedContact.name)
            };
            this.spinnerService.showSpinner(true);
            this.aipReviewService.updateActionItemReview(reqParams)
                .then(function (response) {
                _this.spinnerService.showSpinner(false);
                if (response.data.success) {
                    _this.displayNotification(response.data.message, "success");
                    _this.dirtyFlag = false;
                    _this.$state.reload();
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
        ReviewActionItemCtrl.prototype.onValueChange = function () {
            this.dirtyFlag = true;
        };
        ReviewActionItemCtrl.prototype.resetValues = function () {
            this.$state.reload();
        };
        ReviewActionItemCtrl.prototype.reviewStateValidation = function (selectedCode) {
            var isValidReviewCode = false;
            this.actionItemReviewStatusList.forEach(function (element) {
                if (element.code === selectedCode) {
                    isValidReviewCode = true;
                }
            });
            return isValidReviewCode;
        };
        ReviewActionItemCtrl.prototype.isAnyFieldModified = function () {
            var isAnyFieldModified = false;
            if (this.selectedReviewState.code !== this.actionItemDetailsClone.reviewStateObject.code) {
                isAnyFieldModified = true;
            }
            if (!isAnyFieldModified && this.actionItemDetailsClone.displayEndDate !== this.actionItemDetails.displayEndDate) {
                isAnyFieldModified = true;
            }
            if (!isAnyFieldModified && this.actionItemDetailsClone.reviewAuditObject.contactInfo !== this.selectedContact.name) {
                isAnyFieldModified = true;
            }
            if (!isAnyFieldModified && this.actionItemDetailsClone.reviewAuditObject.reviewComments !== this.reviewComments) {
                isAnyFieldModified = true;
            }
            if (!isAnyFieldModified && this.actionItemDetailsClone.reviewAuditObject.externalCommentInd !== this.externalCommentInd) {
                isAnyFieldModified = true;
            }
            return isAnyFieldModified;
        };
        return ReviewActionItemCtrl;
    })();
    AIP.ReviewActionItemCtrl = ReviewActionItemCtrl;
})(AIP || (AIP = {}));
register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
//# sourceMappingURL=reviewActionItemCtrl.js.map