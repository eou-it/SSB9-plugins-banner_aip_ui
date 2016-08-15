///<reference path="../../../../typings/tsd.d.ts"/>

declare var register: any;


module AIP {
    export class AdminActionListPageCtrl {
        $inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
            "AdminActionService"];
        $state;
        $filter;
        $q: ng.IQService;
        endPoint;
        paginationConfig;
        actionListService;
        draggableColumnNames;
        gridData;
        header;
        constructor($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG,
            AdminActionService) {
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
            this.header = [{
                name: "actionItemId",
                title: "id",
                options: {
                    sortable: true,
                    visible: false,
                    ascending:true,
                    width: 0
                }
            }, {
                name: "actionItemName",
                title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                options: {
                    sortable: true,
                    visible: true,
                    width: 0
                }
            }, {
                name: "folderName",
                title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                options: {
                    sortable: true,
                    visible: true,
                    width: 0
                }
            }, {
                name: "actionItemStatus",
                title: this.$filter("i18n_aip")("aip.list.grid.status"),
                options: {
                    sortable: true,
                    visible: true,
                    width: 0
                }
            }, {
                name: "actionItemUserId",
                title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                options: {
                    sortable: true,
                    visible: true,
                    width: 0
                }
            }, {
                name: "actionItemActivityDate",
                title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                options: {
                    sortable: true,
                    visible: true,
                    width: 0
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


        fetchData(query) {
            var deferred = this.$q.defer();
            this.actionListService.fetchData(query)
                .then((response) => {
                    this.gridData = response;
                    this.gridData.header = this.header;
                    deferred.resolve(this.gridData);
                }, (error) => {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }
        selectRecord(data) {

        }
        refreshGrid() {

        }
    }
}

register("bannerAIP").controller("AdminActionListPageCtrl", AIP.AdminActionListPageCtrl);