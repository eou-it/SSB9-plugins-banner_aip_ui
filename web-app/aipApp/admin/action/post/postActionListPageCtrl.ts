/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
declare var register: any;

module AIP {
    interface IActionListPageCtrlScope {
        vm: PostActionListPageCtrl;

        $apply(): any;
    }

    interface IPostActionListPageCtrl {
        getHeight(): { height: number };

        fetchTableData(query: IPostActionItemListQuery): ng.IPromise<IPostActionItemFetchResponse>;

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
        header;
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
                jobState: 3,
                postingName: 3,
                postingDisplayStartDate: 3,
                groupFolderName: 3,
                postingPopulation: 3,
                groupName: 3,
                postingCreatorId: 3,
                action: 3
            };

            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "dataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.actionItemPostJob"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                name: "postingId",
                title: "id",
                width: "0px",
                options: {
                    sortable: true,
                    visible: false,
                    columnShowHide: false
                }
            }, {
                name: "jobState",
                title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                width: "100px",
                options: {
                    sortable: true,
                    ascending:true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                name: "postingName",
                title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                width: "100px",
                options: {
                    sortable: false,
                    visible: true,
                    columnShowHide: true,
                    ascending: true,
                }
            },
                {
                    name: "postingDisplayStartDate",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupFolderName",
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
                    name: "postingPopulation",
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
                    name: "postingCreatorId",
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
                    name: "postingActionStatus",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.actionstatus"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.actionstatus"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }

                ];


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

        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                // var data = noti.data.newActionItem||noti.data.actionItem;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.common.save.successful"), //+
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
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

        editActionItem(postId) {
                this.actionListService.getPostStatus(postId)
                .then((response) => {

                    while (notifications.length != 0) {
                        notifications.remove(notifications.first())
                    }
                    if (response === "Y")
                    {
                        this.$state.go("admin-post-edit", {postIdval: postId, isEdit: true});
                    }
                    else
                    {
                        while (notifications.length != 0) {
                            notifications.remove(notifications.first())
                        }

                        var n = new Notification({
                            message: this.$filter("i18n_aip")("aip.common.post.edit.noaccess"), //+
                            type: "error",
                            flash: true
                        });

                        setTimeout(() => {
                            notifications.addNotification(n);
                            this.$state.params.noti = undefined;
                            $(".actionItemAddContainer").focus();
                        }, 100);

                    }

                }, (err) => {
                    throw new Error(err);
                });
        }

    }
}

register("bannerAIP").controller("PostActionListPageCtrl", AIP.PostActionListPageCtrl);
