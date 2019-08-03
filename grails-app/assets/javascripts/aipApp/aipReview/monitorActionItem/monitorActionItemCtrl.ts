/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {


    interface IMonitorActionItemCtrl {
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
    }

    export class MonitorActionItemCtrl implements IMonitorActionItemCtrl {

        $inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$filter", "PAGINATIONCONFIG"];
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
        $uibModal;
        spinnerService;
        $sce;
        $timeout;
        $state;
        $q;
        APP_ROOT;
        actionItemNamesList;
        personId;
        personName;
        selected;
        option;
        $filter;
        $scope;
        //grid related
        header;
        //fetchTableData
        gridData;
        records;
        //vm.selectRecord(data);
        searchConfig;
        paginationConfig;
        mobileConfig;
        draggableColumnNames;
        mobileSize;
        query: ISearchActionItemQuery;
        commonPaginationConfig;
        gridEnabled: boolean;
        searchEnabled: boolean;
        gridHeight:number;

        constructor($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $filter, PAGINATIONCONFIG) {
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
            this.actionItemNamesList = [];
            this.personId;
            this.personName;
            this.selected;
            this.option;
            this.$filter = $filter;
            this.commonPaginationConfig = PAGINATIONCONFIG;
            this.init();
        }

        init() {
            this.gridHeight =$("#header-main-section").height()-
                $("#breadcrumbHeader").height()-
                $("#title-panel").height()-
                $(".panel-heading").height()-
                $("#panel-body").height()-
                $("table.data-table.datatable_spacing > caption").height()-
                $("table.data-table").height()




            this.searchEnabled = true;
            this.gridEnabled = false;
            this.spinnerService.showSpinner(true);
            this.aipReviewService.getActionItemList()
                .then((response) => {
                    this.spinnerService.showSpinner(false);
                    this.actionItemNamesList = response.data;
                });
            this.gridData = {};
            this.draggableColumnNames = [];

            this.mobileConfig = {
                actionItemPersonName: 3,
                spridenId: 3,
                actionItemGroupName: 3,
                actionItemName: 3,
                status: 3,
                responseDate: 3,
                currentResponseText: 3,
                displayStartDate: 3,
                displayEndDate: 3,
                reviewIndicator: 3,
                attachments: 3,
                reviewStateCode: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;

            this.header = [{
                name: "id",
                title: "id",
                width: "0px",
                options: {
                    sortable: true,
                    visible: false,
                    columnShowHide: false
                }
            }, {
                name: "actionItemPersonName",
                title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.personName"),
                ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.personName"),
                width: "100px",
                options: {
                    sortable: true,
                    ascending: true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                name: "spridenId",
                title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.spridenId"),
                ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.spridenId"),
                width: "100px",
                options: {
                    sortable: true,
                    ascending: true,
                    visible: true
                }
            }, {
                name: "actionItemGroupName",
                title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.actionItemGroupName"),
                ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.actionItemGroupName"),
                width: "100px",
                options: {
                    sortable: true,
                    ascending: true,
                    visible: true
                }

            },
                {
                    name: "actionItemName",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.actionItemName"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.actionItemName"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "status",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.status"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.status"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true
                    }

                },

                {
                    name: "responseDate",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.responseDate"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.responseDate"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true
                    }

                },


                {
                    name: "currentResponseText",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.currentResponseText"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.currentResponseText"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true
                    }

                },
                {
                    name: "displayStartDate",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayStartDate"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayStartDate"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true
                    }

                },
                {
                    name: "displayEndDate",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayEndDate"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayEndDate"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true
                    }

                },
                {
                    name: "reviewIndicator",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.reviewIndicator"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.reviewIndicator"),
                    width: "25px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true,
                        columnShowHide: true
                    }

                },
                {
                    name: "attachments",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.attachments"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.attachments"),
                    width: "25px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true,
                    }

                }, {
                    name: "reviewStateCode",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.reviewState"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.reviewState"),
                    width: "100px",
                    options: {
                        sortable: true,
                        ascending: true,
                        visible: true
                    }

                }


            ];

            this.searchConfig = {
                id: "dataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("search.aria.label"),
                searchString: "",
                placeholder: this.$filter("i18n_aip")("search.label"),
                maxlength: 200,
                minimumCharacters: 1
            };
            this.paginationConfig = this.commonPaginationConfig;
        }


        fetchData = function (query) {
            this.query = query;
            if (angular.isDefined(this.selected)) {
                query.actionItemId = this.selected.id;
            }
            if (this.option === "personName") {
                query.personName = this.personName
            }
            else {
                query.personId = this.personId
            }
            this.query = query;
            var deferred = this.$q.defer();
            this.aipReviewService.fetchSearchResult(query).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };


        search() {

            if (notifications.hasErrors()) {
                notifications.clearNotifications();
            }

            this.personName = this.personName?this.personName.replace(/^\s+/g, " ").replace(/\s*$/, ""):this.personName;
            if((!this.personName || this.personName === "") && (!this.personId || this.personId === "") && (!this.selected || !this.selected.id)) {
                let errorNotification = new Notification({
                    message: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.search.parameter.error.message"),
                    type: "error",
                    flash: true
                });
                notifications.addNotification(errorNotification);
                return;
            }

            this.gridEnabled = true;
            this.searchEnabled = false;

        }

        reset() {
            this.$state.reload();
        }


        review(userActionItemID: string) {
            console.log("parameter passed", userActionItemID)
            this.$state.go("review-action-item", {userActionItemID: userActionItemID});
        }

        getHeight() {
            var containerHeight = $(document).height()-
                $("#header-main-section").height()-
                $("#breadcrumbHeader").height()-
                $("#title-panel").height()-
                $(".panel-heading").height()-
                $("#panel-body").height()-
                $("table.data-table.datatable_spacing > caption").height()-
                $("table.data-table").height();

            return {height: containerHeight};
        }

    }
}

angular.module("bannerAIPReview").controller("monitorActionItemCtrl", AIP.MonitorActionItemCtrl);
