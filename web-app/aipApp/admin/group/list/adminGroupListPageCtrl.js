//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupListPageCtrl = (function () {
        function AdminGroupListPageCtrl($scope, AdminGroupService, $state, $window, $filter, ENDPOINT) {
            this.$inject = ["$scope", "AdminGroupService", "$state", "$window", "$filter", "ENDPOINT"];
            $scope.vm = this;
            this.adminGroupService = AdminGroupService;
            this.$state = $state;
            this.ENDPOINT = ENDPOINT;
            this.$filter = $filter;
            this.init();
            $scope.$watch("vm.gridData", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            });
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
        }
        AdminGroupListPageCtrl.prototype.init = function () {
            var _this = this;
            this.adminGroupService.getGroupList().then(function (response) {
                _this.gridData = response;
            }, function (err) {
                console.log(err);
            });
        };
        AdminGroupListPageCtrl.prototype.add = function () {
            this.$state.go("admin-group-add");
        };
        AdminGroupListPageCtrl.prototype.select = function (data) {
            if (data) {
                this.selectedGroup = data.id;
                this.enableOpen();
            }
        };
        AdminGroupListPageCtrl.prototype.enableOpen = function () {
            $("#openGroupBtn").removeAttr("disabled");
        };
        AdminGroupListPageCtrl.prototype.open = function () {
            var _this = this;
            this.adminGroupService.getGroupDetail(this.selectedGroup)
                .then(function (response) {
                if (response.group) {
                    _this.$state.go("admin-group-open", { grp: response.group.id });
                }
                else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminGroupListPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".groupListContainer .control").height() -
                30;
            return { height: containerHeight };
        };
        return AdminGroupListPageCtrl;
    }());
    AIP.AdminGroupListPageCtrl = AdminGroupListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupListPageCtrl", AIP.AdminGroupListPageCtrl);
//# sourceMappingURL=adminGroupListPageCtrl.js.map