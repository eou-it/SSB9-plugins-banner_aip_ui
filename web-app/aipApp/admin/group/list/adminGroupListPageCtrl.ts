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
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"), //+
                        //"</br>Title: " + data.groupTitle +
                        //"</br>Status: " + data.groupStatus +
                        //"</br>Folder: " + data.folderName,
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".groupListContainer .controls .control button").focus();
                }, 500);
            }
        }
        add() {
            this.$state.go("admin-group-add");
        }
        select(data,index) {
            this.selectedGroup = data.id
            this.enableOpen();
        }
        enableOpen() {
            $("#openGroupBtn").removeAttr("disabled");
        }
        open() {
            this.adminGroupService.getGroupDetail(this.selectedGroup)
                .then((response:IGroupDetailResponse) => {
                    //this.$state.go("admin-group-open");
                    //var groupParams = {};
                    if(response.group) {
                        this.$state.go("admin-group-open", {grp: response.group});
                    } else {
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