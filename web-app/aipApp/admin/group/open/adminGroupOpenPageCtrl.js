///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupOpenPageCtrl = (function () {
        function AdminGroupOpenPageCtrl($scope, AdminGroupService, $q, SpinnerService, $state, $filter, $sce) {
            this.$inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce"];
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            $scope.$watch("[vm.groupDetailResponse, vm.groupInfo]", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            }, true);
            this.init();
        }
        AdminGroupOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            // console.log(this.$state.params);
            this.adminGroupService.getGroupDetail(this.$state.params.data).then(function (response) {
                _this.groupInfo = response.group;
                _this.groupFolder = response.folder;
                $("#title-panel h1").html(_this.groupInfo.title);
                $("p.openGroupTitle").html(_this.groupInfo.title);
                $("p.openGroupFolder").html(_this.groupFolder[0].folderName);
                $("p.openGroupStatus").html(_this.$filter("i18n_aip")(_this.groupInfo.status));
                $("p.openGroupDesc").html(_this.groupInfo.description);
                $("p.openGroupActivityDate").html(_this.groupFolder[0].groupActivityDate);
                $("p.openGroupLastUpdatedBy").html(_this.groupFolder[0].groupUserId);
                //console.log(this.groupInfo);
            }, function (err) {
                console.log(err);
            });
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
            });
        };
        ;
        AdminGroupOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var data = noti.data.newGroup[0];
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".groupAddContainer").focus();
                }, 500);
            }
        };
        return AdminGroupOpenPageCtrl;
    }());
    AIP.AdminGroupOpenPageCtrl = AdminGroupOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
//# sourceMappingURL=adminGroupOpenPageCtrl.js.map