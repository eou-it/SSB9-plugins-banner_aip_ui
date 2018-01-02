/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>

declare var register: any;

module AIP {
    interface IActionListPageCtrlScope {
        vm: AdminActionListPageCtrl;
        $apply():any;
    }
    interface IAdminActionListPageCtrl {
        getHeight(): {height:number};
        fetchData(query:IActionItemListQuery):ng.IPromise<IActionItemFetchResponse>;
        selectRecord(data:any):void;
        goAddPage():void;
    }

    export class AdminActionListPageCtrl implements IAdminActionListPageCtrl{
        $inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
            "AdminActionService"];
        $state;
        $scope;
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
            this.$scope = $scope;
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
                actionItemName: 3,
                folderName: 3,
                actionItemStatus: 3,
                actionItemLastUserId: 3,
                actionItemCompositeDate: 3,
                actionStatus:3
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
                name: "actionItemName",
                title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    ascending:true,
                    columnShowHide: false
                }
            }, {
                name: "folderName",
                title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.folder"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: false
                }
            }, {
                name: "actionItemStatus",
                title: this.$filter("i18n_aip")("aip.list.grid.status"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                name: "actionItemLastUserId",
                title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                name: "actionItemCompositeDate",
                title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            },
                {
                    name: "actionStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.actionStatus"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.actionStatus"),
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

        deleteBlock(cantDeleteMessage) {
            var n = new Notification({
                message: cantDeleteMessage,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }

        deleteUnblock(map, name, $scope) {
            var n = new Notification({
                message: this.$filter("i18n_aip")("aip.common.action.item.action.delete.warning"),
                type: "warning",
            });
            var actionService = this.actionListService;
            var keyValue = {
                actionItemId: map
            };

            var refreshGrid = this.$scope;
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                notifications.remove(n);
            })
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                actionService.deleteStatus(keyValue).then((response) => {
                    if (response.data.success) {
                        refreshGrid.refreshGrid(true);
                        var n1 = new Notification({
                            message: response.data.message,
                            type: "success",
                            flash: true
                        });
                        notifications.remove(n);
                        notifications.addNotification(n1);
                    }
                    else {
                        var n2 = new Notification({
                            message: response.data.message,
                            type: "error",
                            flash: true
                        });
                        notifications.remove(n, n1);
                        notifications.addNotification(n2);
                    }

                });
            });
            notifications.addNotification(n);

        }

        goAddPage() {
            this.$state.go("admin-action-add");
        }
        // goOpenPage() {
        //
        // }

        openActionItem(id) {
            this.$state.go("admin-action-open", { actionItemId: id});
        }
    }
}

register("bannerAIP").controller("AdminActionListPageCtrl", AIP.AdminActionListPageCtrl);
