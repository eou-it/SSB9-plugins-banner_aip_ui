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
                if (_this.$state.params.noti) {
                    _this.handleNotification(_this.$state.params.noti);
                }
            }, function (err) {
                console.log(err);
            });
        };
        AdminGroupListPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var data = noti.data.newGroup[0];
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"),
                    //"</br>Title: " + data.groupTitle +
                    //"</br>Status: " + data.groupStatus +
                    //"</br>Folder: " + data.folderName,
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".groupListContainer .controls .control button").focus();
                }, 500);
            }
        };
        AdminGroupListPageCtrl.prototype.add = function () {
            this.$state.go("admin-group-add");
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