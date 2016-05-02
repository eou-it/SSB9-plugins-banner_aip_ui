//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

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
                if(this.$state.params.noti) {
                    this.handleNotification(this.$state.params.noti);
                }
            }, (err) => {
                console.log(err);
            });
        }
        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                var data = noti.data.newGroup[0];
                var n = new Notification({
                    message: "Group successfully added." +
                        "</br>Title: " + data.groupTitle +
                        "</br>Status: " + data.groupStatus +
                        "</br>Folder: " + data.folderName,
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                }, 500);
            }
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