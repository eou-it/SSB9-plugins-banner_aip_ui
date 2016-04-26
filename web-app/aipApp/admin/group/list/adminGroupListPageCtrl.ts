//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register;

module AIP {
    export class AdminGroupListPageCtrl {
        $inject = ["$scope", "AdminGroupService", "$state", "$window", "ENDPOINT"];
        gridData: IGridData;
        $state;
        ENDPOINT;
        adminGroupService: AIP.AdminGroupService;
        constructor($scope, AdminGroupService, $state, $window, ENDPOINT) {
            $scope.vm = this;
            this.adminGroupService = AdminGroupService
            this.$state = $state;
            this.ENDPOINT = ENDPOINT;
            this.init();
            $scope.$watch("vm.gridData", (newVal, oldVal) => {
                if(!$scope.$$phase) {
                    $scope.apply();
                }
            });
            angular.element($window).bind('resize', function() {
                //$scope.onResize();
                $scope.$apply();
            });
        }
        init() {
            this.adminGroupService.getGroupList().then((response:IGridData) => {
                this.gridData = response;
            }, (err) => {
                console.log(err);
            });
        }
        add() {
            this.$state.go("admin-group-add");
        }
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
    }
}

register("bannerAIP").controller("AdminGroupListPageCtrl", AIP.AdminGroupListPageCtrl);