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

        gridData;

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
            // $scope.$watch("[vm.gridData]" , (newVal, oldVal) => {
            //     if(!$scope.$$phase) {
            //         $scope.apply();
            //     }
            // });

        }
        init() {
            //todo: anything needing to be moved here?
            this.gridData = {};
            // this.actionListService.getActionLists()
            //     .then((response) => {
            //         this.gridData.rows = response.data;
            //     }, (err) => {
            //         console.log(err);
            // });
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
                    deferred.resolve(response);
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