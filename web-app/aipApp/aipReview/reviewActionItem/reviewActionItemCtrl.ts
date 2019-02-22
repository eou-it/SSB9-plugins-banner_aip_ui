/*********************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
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

        $inject = ["$scope","$rootScope","$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$filter","$window", "datePicker"];
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
        $uibModal;
        spinnerService;
        $sce;
        $timeout;
        $scope;
        $rootScope;
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
        redirectval;

        constructor($scope,$rootScope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $filter,$window) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
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
            this.redirectval="";

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

            $window.onbeforeunload = (event)=> {
                if(this.dirtyFlag) {
                    return this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                $window.onbeforeunload = null;
            };
        }

        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            allPromises.push(
                this.aipReviewService.getActionItem(this.$state.params.userActionItemID)
                    .then((response) => {
                        this.actionItemDetails = response.data;
                        this.actionItemDetailsClone = jQuery.extend({}, response.data);
                        this.userActionItemId = this.actionItemDetails.id;
                        this.responseId = this.actionItemDetails.responseId;
                        this.selectedReviewState = this.actionItemDetails.reviewStateObject;
                        if(this.actionItemDetails.reviewAuditObject){
                            this.selectedContact.name = (this.actionItemDetails.reviewAuditObject.contactInfo === "undefined") ? this.selectNone : this.actionItemDetails.reviewAuditObject.contactInfo;
                            this.externalCommentInd = this.actionItemDetails.reviewAuditObject.externalCommentInd;
                            this.reviewComments = (this.actionItemDetails.reviewAuditObject.reviewComments) ? this.actionItemDetails.reviewAuditObject.reviewComments : "";
                        }
                    }),
                this.aipReviewService.getContactInformation()
                    .then((response) => {
                        this.contactInformationList = response.data;
                        var selectObject = {
                        	"name": this.selectNone,
                        	"type": "string",
                        	"value": this.selectNone
                        };
                        this.contactInformationList.unshift(selectObject);
                    }),
                this.aipReviewService.getReviewStatusList()
                    .then((response) => {
                        this.actionItemReviewStatusList = response;
                        if(this.actionItemReviewStatusList.length == 0){
                            this.displayNotification(this.$filter("i18n_aip")("aip.review.status.text.unavailable"), "error");
                        }
                    })
            );
            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
            var that=this;
            this.$scope.$on("DetectChanges",function(event, args)
            {
                if (that.dirtyFlag){
                    that.redirectval = args.state;
                    that.checkchangesDone();
                }
            });




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
                            var fileExtension = fileNameSplit[fileNameSplit.length - 1].toLowerCase();
                            var windowRefObject;
                            var iframe;

                            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
                                var byteCharacters = atob(base64Encoded);
                                var byteNumbers = new Array(byteCharacters.length);
                                for (var i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                var byteArray = new Uint8Array(byteNumbers);
                                var blob = new Blob([byteArray], {type: 'application/pdf'});
                                window.navigator.msSaveOrOpenBlob(blob, row.documentName);
                                return;
                            }

                            if (fileExtension ==='pdf'|| fileExtension ==='jpg' || fileExtension ==='jpeg' || fileExtension ==='png' ||fileExtension ==='txt') {
                                if (navigator.userAgent.indexOf("Chrome") != -1 ) {   //chrome
                                    windowRefObject = window.open('about:whatever');
                                }
                                else{  //firefox and other browsers not IE
                                    windowRefObject = window.open();
                                }
                                iframe = windowRefObject.document.createElement('iframe')
                                iframe.width = '100%';
                                iframe.height = '100%';
                            }

                            switch (fileExtension) {
                                case "pdf":
                                    var pdfWindow = "data:application/pdf;base64," + base64Encoded;
                                    iframe.src = pdfWindow;
                                    windowRefObject.document.body.appendChild(iframe);
                                    break;
                                case "jpg":
                                    var jpgWindow = "data:image/jpeg;base64," + base64Encoded;
                                    iframe.src = jpgWindow;
                                    windowRefObject.document.body.appendChild(iframe);
                                    break;
                                case "jpeg":
                                    var jpegWindow = "data:image/jpeg;base64," + base64Encoded;
                                    iframe.src = jpegWindow;
                                    windowRefObject.document.body.appendChild(iframe);
                                    break;
                                case "png":
                                    var pngWindow = "data:image/png;base64," + base64Encoded;
                                    iframe.src = pngWindow;
                                    windowRefObject.document.body.appendChild(iframe);
                                    break;
                                case "txt":
                                    var txtWindow = "data:text/plain;base64," + base64Encoded;
                                    iframe.src = txtWindow;
                                    windowRefObject.document.body.appendChild(iframe);
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
            if(!this.isAnyFieldModified()){
                this.displayNotification(this.$filter("i18n_aip")("aip.review.action.update.review.fields.validation.error"), "error");
                return;
            }
            var reqParams = {
                userActionItemId: this.actionItemDetails.id,
                responseId: this.actionItemDetails.responseId,
                reviewStateCode: this.selectedReviewState.code,
                displayEndDate: this.actionItemDetails.displayEndDate,
                externalCommentInd: this.externalCommentInd,
                reviewComments: (this.reviewComments) ? this.reviewComments : "",
                contactInfo: encodeURIComponent((this.selectedContact.name && (this.selectedContact.name !== this.selectNone)) ? this.selectedContact.name : "")
            };

            this.spinnerService.showSpinner(true);
            this.aipReviewService.updateActionItemReview(reqParams)
                .then((response) => {
                    this.spinnerService.showSpinner(false);
                    if (response.data.success) {
                        this.displayNotification(response.data.message, "success");
                        this.dirtyFlag = false;
                        this.$state.reload();
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
            this.$rootScope.DataChanged = true;
        }

        resetValues(){
            this.$state.reload();

        }

        reviewStateValidation(selectedCode){
            var isValidReviewCode = false;
            this.actionItemReviewStatusList.forEach(function(element) {
                if(element.code === selectedCode ){
                    isValidReviewCode = true;
                }
            });
            return isValidReviewCode;
        }

        isAnyFieldModified(){
            var isAnyFieldModified = false;
            if(this.selectedReviewState.code !== this.actionItemDetailsClone.reviewStateObject.code){
                isAnyFieldModified = true;
            }
            if(!isAnyFieldModified && this.actionItemDetailsClone.displayEndDate !== this.actionItemDetails.displayEndDate){
                isAnyFieldModified = true;
            }

            if(!isAnyFieldModified && this.actionItemDetailsClone.reviewAuditObject.contactInfo !== this.selectedContact.name){
                isAnyFieldModified = true;
            }
            if(!isAnyFieldModified  && this.actionItemDetailsClone.reviewAuditObject.reviewComments !== this.reviewComments){
                isAnyFieldModified = true;
            }
            if(!isAnyFieldModified  && this.actionItemDetailsClone.reviewAuditObject.externalCommentInd !== this.externalCommentInd){
                isAnyFieldModified = true;
            }
            return  isAnyFieldModified ;
        }

        checkchangesDone() {
            if (this.dirtyFlag) {
                var n = new Notification({
                    message: this.$filter("i18n_aip")( "aip.admin.actionItem.saveChanges"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    notifications.remove(n);

                })
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    location.href = this.redirectval;
                    this.dirtyFlag = false;
                    this.$rootScope.DataChanged=false;
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
        }

    }
}

register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
