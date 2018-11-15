/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
declare var register;

module AIP {


    interface IReviewActionItemCtrl {
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
    }

    export class ReviewActionItemCtrl implements IReviewActionItemCtrl {

        $inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce","$filter"];
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
        actionItems: IActionItem[];
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
            this.actionItemNamesList=[];
            this.actionItemDetails = null;
            this.personId;
            this.personName;
            this.selected;
            this.option;
            this.showModal = false;
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
                           name: "attachmentName",
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
                           name: "uploadedDate",
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
                                           name: "location",
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
                                           name: "comments",
                                           title: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.comments"),
                                           ariaLabel: $filter("i18n_aip")("js.aip.review.monitor.action.viewAttachments.modal.grid.header.comments"),
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
            $scope.fetchData = function (query: AIP.IAttachmentListQuery) {

                            var deferred = $q.defer();
                            query.actionItemId = this.actionItemDetails.actionItemId;
                            query.responseId = this.actionItemDetails.responseId;
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
        }

        init() {
            var allPromises = [];
            allPromises.push(
                this.aipReviewService.getActionItem(this.$state.params.userActionItemID)
                    .then((response) => {
                        this.actionItemDetails = response.data;
                    })
            );

        }
        viewAttachemnts(){
            this.showModal = true;
         }
    }
}

register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
