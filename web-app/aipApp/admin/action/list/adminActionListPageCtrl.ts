///<reference path="../../../../typings/tsd.d.ts"/>

declare var register: any;


module AIP {
    export class AdminActionListPageCtrl {
        $inject = ["$scope", "$state", "$window", "$filter", "ENDPOINT", "PAGINATIONCONFIG",
            "AdminActionService"];
        $state;
        $filter;
        endPoint;
        paginationConfig;
        actionListService;

        gridData;

        constructor($scope, $state, $window, $filter, ENDPOINT, PAGINATIONCONFIG,
            AdminActionService) {
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
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
            //todo: anything needing to be moved here?
            this.gridData = {};
            this.actionListService.getActionLists()
                .then((response) => {
                    this.gridData = response.data;
                }, (err) => {
                    console.log(err);
            });
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

        }
        selectRecord(data) {

        }
        refreshGrid() {

        }
    }
}

register("bannerAIP").controller("AdminActionListPageCtrl", AIP.AdminActionListPageCtrl);