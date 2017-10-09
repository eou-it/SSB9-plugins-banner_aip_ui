///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>

declare var register: any;

module AIP {
    interface IActionListPageCtrlScope {
        vm: PostActionListPageCtrl;
        $apply():any;
    }
    interface IPostActionListPageCtrl {
        getHeight(): {height:number};
        fetchData(query:IActionItemListQuery):ng.IPromise<IActionItemFetchResponse>;
        selectRecord(data:any):void;
        goAddPage():void;
    }

    export class PostActionListPageCtrl implements IPostActionListPageCtrl{
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
            angular.element($window).bind('resize', function() {
                //$scope.onResize();
                $scope.$apply();
            });
        }
        init() {
            this.gridData = {};
            this.draggableColumnNames=[];
            this.mobileConfig = {
                jobStatus: 3,
                jobName: 3,
                scheduleDate: 3,
                groupFolder: 3,
                group: 3,
                submittedBy:3,
                action:3
            };
            this.mobileSize = angular.element("body").width()>768?false:true;
            this.searchConfig = {
                id: "actionItemDataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.actionItem"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                name: "actionItemId",
                title: "id",
                width: "0px",
                options: {
                    sortable: true,
                    visible: false,
                    columnShowHide: false
                }
            }, {
                name: "jobStatus",
                title: this.$filter("i18n_aip")("aip.list.grid.jobStatus"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.jobStatus"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    ascending:true,
                    columnShowHide: false
                }
            }, {
                name: "jobName",
                title: this.$filter("i18n_aip")("aip.list.grid.jobName"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.jobName"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: false
                }
            },
                {
                name: "scheduleDate",
                title: this.$filter("i18n_aip")("aip.list.grid.scheduleDate"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.scheduleDate"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                name: "groupFolder",
                title: this.$filter("i18n_aip")("aip.list.grid.groupFolder"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.groupFolder"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            },
                {
                    name: "group",
                    title: this.$filter("i18n_aip")("aip.list.grid.group"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.group"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "submittedBy",
                    title: this.$filter("i18n_aip")("aip.list.grid.submittedBy"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.submittedBy"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "action",
                    title: this.$filter("i18n_aip")("aip.list.grid.action"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.action"),
                    width: "100px",
                    options: {
                        sortable: true,
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


        fetchData(query:AIP.IActionItemListQuery) {

            var deferred = this.$q.defer();
            this.actionListService.fetchData(query)
                .then((response:AIP.IActionItemFetchResponse) => {
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
            this.$state.go("admin-action-add");
        }
        // goOpenPage() {
        //
        // }

        openActionItem() {
            this.$state.go("admin-action-open", { data: this.selectedRecord.id });
        }
    }
}

register("bannerAIP").controller("PostActionListPageCtrl", AIP.PostActionListPageCtrl);