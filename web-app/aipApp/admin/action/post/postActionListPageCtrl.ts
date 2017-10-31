///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
declare var register: any;

module AIP {
    interface IActionListPageCtrlScope {
        vm: PostActionListPageCtrl;

        $apply(): any;
    }

    interface IPostActionListPageCtrl {
        getHeight(): { height: number };

        fetchData(query: IActionItemListQuery): ng.IPromise<IPostActionItemFetchResponse>;

        selectRecord(data: any): void;

        goAddPage(): void;
    }

    export class PostActionListPageCtrl implements IPostActionListPageCtrl {
        $inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
            "AdminActionService"];
        $state;
        $filter;
        $q: ng.IQService;
        endPoint;
        paginationConfig;
        actionListService: AIP.AdminActionService;
        draggableColumnNames;
        gridData;
        header: [AIP.IActionItemHeader];
        searchConfig;
        mobileConfig;
        mobileSize: boolean;
        selectedRecord;

        constructor($scope: IActionListPageCtrlScope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG,
                    AdminActionService: AIP.AdminActionService) {
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT;   //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.actionListService = AdminActionService;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
        }

        init() {
            this.gridData = {};
            this.draggableColumnNames = [];
            this.mobileConfig = {
                jobStatus: 3,
                jobName: 3,
                postingStartScheduleDate: 3,
                groupFolder: 3,
                population: 3,
                group: 3,
                submittedBy: 3,
                action: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "actionItemPostJobsDataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.actionItemPostJob"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                name: "jobId",
                title: "jobId",
                width: "0px",
                options: {
                    sortable: true,
                    visible: false,
                    columnShowHide: false
                }
            }, {
                name: "jobStatus",
                title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                width: "100px",
                options: {
                    sortable: false,
                    visible: true,
                    ascending: true,
                    columnShowHide: true
                }
            }, {
                name: "jobName",
                title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                width: "100px",
                options: {
                    sortable: false,
                    visible: true,
                    columnShowHide: true
                }
            },
                {
                    name: "postingStartScheduleDate",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupFolder",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.folder"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.folder"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "population",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.population"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.population"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "groupName",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.name"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.name"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "submittedBy",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.submittedBy"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.submittedBy"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "action",
                    title: this.$filter("i18n_aip")("aip.action.item.list.grid.action"),
                    ariaLabel: this.$filter("i18n_aip")("aip.action.item.list.grid.action"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }];


        }

        getHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".actionListContainer .control").height() -
                30;
            return {height: containerHeight};
        }


        fetchTableData(query: AIP.IPostActionItemListQuery) {

            var deferred = this.$q.defer();
            this.actionListService.fetchTableData(query)
                .then((response: AIP.IPostActionItemFetchResponse) => {
                    // this.gridData = response;
                    // this.gridData.header = this.header;
                    deferred.resolve(response);
                }, (error) => {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        selectRecord(data) {
            this.selectedRecord = data;
            // this.actionListService.enableActionItemOpen(data.id);
            // this.$state.params.actionid = data.id;
        }

        refreshGrid() {

        }

        goAddPage() {
            this.$state.go("admin-post-add");
        }

        // goOpenPage() {
        //
        // }

        openActionItem() {
            this.$state.go("admin-action-open", {data: this.selectedRecord.id});
        }
    }
}

register("bannerAIP").controller("PostActionListPageCtrl", AIP.PostActionListPageCtrl);
