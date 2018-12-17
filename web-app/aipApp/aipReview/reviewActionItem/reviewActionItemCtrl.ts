/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
///<reference path="../../common/services/spinnerService.ts"/>
declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {

    interface IReviewActionItemCtrl {
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
    }

    export class ReviewActionItemCtrl implements IReviewActionItemCtrl {

        $inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$filter", "datePicker"];
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
        contactInformationList;
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
        userActionItemId;
        actionItemReviewStatusList;
        selectedReviewState;
        externalCommentInd;
        reviewComments;
        selectedContact;
        dirtyFlag:boolean;
        actionItemDetailsClone;
        selectNone;

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
            this.selectedContact={};
            this.externalCommentInd = true;
            this.reviewComments;
            this.selectedReviewState = {};
            this.dirtyFlag = false;
            this.actionItemDetailsClone=null;
            this.selectNone =$filter("i18n_aip")("js.aip.action.selected.name");

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

        init() {
            var allPromises = [];
            allPromises.push(
                this.aipReviewService.getActionItem(this.$state.params.userActionItemID)
                    .then((response) => {
                        this.actionItemDetails = response.data;
                        this.actionItemDetailsClone = jQuery.extend({}, response.data);
                        this.userActionItemId = this.actionItemDetails.id;
                        this.responseId = this.actionItemDetails.responseId;
                        this.selectedReviewState = this.actionItemDetails.reviewStateObject;
                        this.selectedContact.name = this.actionItemDetails.contactInfo;

                    }),
                this.aipReviewService.getContactInformation()
                    .then((response) => {
                        this.contactInformationList = response.data;
                        var selectObject = {
                        	"name": "",
                        	"type": "string",
                        	"value": this.selectNone,
                        };
                        this.contactInformationList.unshift(selectObject);
                    })
            );
            this.getReviewStatusList();
        }

        /**
         * Gets list of attached document for a response.
         * @param query
         */
        fetchData = function (query) {
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
        viewAttachments() {
            this.showModal = true;
            this.userActionItemId = this.actionItemDetails.id;
            this.responseId = this.actionItemDetails.responseId;
        }


        getReviewStatusList() {
            this.aipReviewService.getReviewStatusList()
                .then((response) => {
                    this.actionItemReviewStatusList = response;
                })
        }

        reset(vm) {
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
        }

        updateActionItemReview() {
            if(!this.reviewStateValidation(this.selectedReviewState.code)){
                this.displayNotification(this.$filter("i18n_aip")("aip.review.action.update.review.state.error"), "error");
                return;
            }
            if(!this.isFiledsModified()){
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
                .then((response) => {
                    this.spinnerService.showSpinner(false);
                    if (response.data.success) {
                        this.displayNotification(response.data.message, "success");
                        this.dirtyFlag = false;
                        this.actionItemDetailsClone.reviewStateObject.code = this.selectedReviewState.code;
                        this.actionItemDetailsClone.displayEndDate = this.actionItemDetails.displayEndDate;
                        this.actionItemDetailsClone.contactInfo = this.selectedContact.name;
                    } else {
                        this.displayNotification(response.data.message, "error");
                    }
                })
        }

        displayNotification(message, errorType) {
            var n = new Notification({
                message: message,
                type: errorType,
                flash: true
            });
            notifications.addNotification(n);
        }

        onValueChange(){
            this.dirtyFlag = true;
        }

        resetValues(){
            location.reload();
        }

        reviewStateValidation(selectedCode){
            var isValidReveiwCode = false;
            this.actionItemReviewStatusList.forEach(function(element) {
                if(element.code === selectedCode ){
                    isValidReveiwCode = true;
                }
            });
            return isValidReveiwCode;
        }

        isFiledsModified(){
            var isFiledsModified = false;
            if(this.selectedReviewState.code !== this.actionItemDetailsClone.reviewStateObject.code){
                isFiledsModified = true;
            }
            if(!isFiledsModified && this.actionItemDetailsClone.displayEndDate !== this.actionItemDetails.displayEndDate){
                isFiledsModified = true;
            }

            if(!isFiledsModified && this.actionItemDetailsClone.contactInfo !== this.selectedContact.name){
                isFiledsModified = true;
            }
            if(!isFiledsModified  && this.reviewComments !== ''){
                isFiledsModified = true;
            }
            return  isFiledsModified ;
        }

    }
}

register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
