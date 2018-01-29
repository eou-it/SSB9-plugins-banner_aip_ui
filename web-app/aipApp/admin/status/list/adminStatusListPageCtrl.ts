/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/

//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

module AIP {
    export class AdminStatusListPageCtrl {
        $inject = ["$scope", "$state", "$window", "$filter", "$http", "$q", "$uibModal",
            "ENDPOINT", "PAGINATIONCONFIG", "AdminActionStatusService", "APP_ROOT"];
        $scope;
        $state;
        $filter;
        $q: ng.IQService;
        $uibModal;
        endPoint;
        paginationConfig;
        draggableColumnNames;
        gridData;
        header;
        searchConfig;
        mobileConfig;
        mobileSize;
        adminActionStatusService;
        selectedRecord;
        APP_ROOT;
        modalInstance;
        statusModel;

        constructor($scope, $state, $window, $filter, $q, $http, $uibModal, ENDPOINT, PAGINATIONCONFIG,
                    AdminActionStatusService, APP_ROOT) {
            $scope.vm = this;
            $scope.disableSystemRecord = function (data) {

                alert(data);

            }

            this.$scope = $scope;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.endPoint = ENDPOINT;   //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.modalInstance;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
        }

        init() {
            this.gridData = {};
            this.draggableColumnNames = [];
            this.mobileConfig = {
                actionItemStatus: 3,
                actionItemSystemRequired: 3,
                actionItemLastUpdatedBy: 3,
                actionItemActivityDate: 3,
                actionItemStatusNotification: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "statusDataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.status"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
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
                name: "actionItemStatus",
                title: this.$filter("i18n_aip")("aip.list.grid.status"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    ascending: true,
                    columnShowHide: false
                }
            },
                {
                    name: "actionItemStatusBlockedProcess",
                    title: this.$filter("i18n_aip")("aip.list.grid.blockedProcess"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.blockedProcess"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
                        columnShowHide: false
                    }
                },
                {
                    name: "actionItemStatusSystemRequired",
                    title: this.$filter("i18n_aip")("aip.list.grid.systemRequired"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.systemRequired"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "actionItemStatusUserId",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "actionItemStatusActivityDate",
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
                    name: "actionTobeTaken",
                    title: this.$filter("i18n_aip")("aip.list.grid.actionTobeTaken"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.actionTobeTaken"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }
            ];
        }

        getIndicatorVal() {

        }

        goAddPage() {
            this.modalInstance = this.$uibModal.open({
                templateUrl: this.APP_ROOT + "admin/status/list/add/statusAddTemplate.html",
                controller: "StatusAddModalCtrl",
                controllerAs: "$ctrl",
                size: "sm",
                windowClass: "aip-modal"
            });
            this.modalInstance.result.then((result) => {
                console.log(result);
                if (result.success) {
                    //TODO:: send notification and refresh grid
                    var n = new Notification({
                        message: this.$filter("i18n_aip")("aip.common.save.successful"),
                        type: "success",
                        flash: true
                    });
                    notifications.addNotification(n);
                    this.$scope.refreshGrid(true);  //use scope to call grid directive's function
                    // this.refreshGrid(true);
                } else {
                    //TODO:: send error notification
                }
            }, (error) => {
                console.log(error);
            });
        }

        disableSystemRecord(deleteRestrictionReason) {
            var n = new Notification({
                message: deleteRestrictionReason,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }

        deleteSystemRecord(map, name, $scope) {
            var n = new Notification({
                message: this.$filter("i18n_aip")("aip.common.action.item.status.delete.warning"),
                type: "warning",
            });
            var actionService = this.adminActionStatusService;
            var keyValue = {
                id: map
            };

            var refreshGrid = this.$scope;
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                notifications.remove(n);
            })
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                actionService.removeStatus(keyValue).then((response) => {
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

        /*

        add() {
            this.$state.go("admin-group-add");
        }

        open() {
            this.adminActionStatusService.getGroupDetail(this.$state.params.status).then((response) => {
                if(response.group) {
                    this.$state.go("admin-group-open", {data: response.group});
                } else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
            }, (err) => {
                //TODO:: handle error call
                console.log(err);
            });
        }
        */

        getHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".groupListContainer .control").height() -
                30;
            return {height: containerHeight};
        }

        fetchData(query) {
            var deferred = this.$q.defer();
            this.adminActionStatusService.fetchData(query)
                .then((response) => {
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
            //this.adminActionStatusService.enableGroupOpen(data.id);
            //this.$state.params.grp = data.id;
        }

        // refreshGrid() {
        //     console.log("Refresh");
        // }
    }
}

register("bannerAIP").controller("AdminStatusListPageCtrl", AIP.AdminStatusListPageCtrl);
