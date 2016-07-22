//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

module AIP {
    export class AdminGroupListPageCtrl {
        $inject = ["$scope", "AdminGroupService", "$state", "$window", "$filter", "ENDPOINT"];
        gridData: IGridData;
        $state;
        $filter;
        ENDPOINT;
        selectedGroup;
        adminGroupService: AIP.AdminGroupService;
        constructor($scope, AdminGroupService, $state, $window, $filter, ENDPOINT) {
            $scope.vm = this;
            this.adminGroupService = AdminGroupService
            this.$state = $state;
            this.ENDPOINT = ENDPOINT;
            this.$filter = $filter;
            this.selectedGroup;
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
        select(data) {
            if (data) {

                this.selectedGroup = data
                this.enableOpen();
            }
        }
        enableOpen() {
            $("#openGroupBtn").removeAttr("disabled");
        }
        open() {
            this.adminGroupService.getGroupDetail(this.selectedGroup.id).then((response:IGroupDetailResponse) => {
                if(response.group) {
                        this.$state.go("admin-group-open", {grp: response.group.id});
                    } else {
                        //todo: output error in notification center?
                        console.log("fail");
                    }
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
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