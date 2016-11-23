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
            this.init();
        }
        AdminGroupOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupFolder = this.$state.params.data;
            console.log(this.groupFolder);
            //var groupDescHtml = this.$sce.trustAsHtml(this.$state.params.data.description);
            //console.log(groupDescHtml);
            //todo: replace this temporary workaround for sce not working for description
            $("p.openGroupDesc").html(this.$state.params.data.groupDesc);
            $("#title-panel h1").html(this.$state.params.data.groupTitle);
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
                var data = noti.data.group[0];
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
    })();
    AIP.AdminGroupOpenPageCtrl = AdminGroupOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
//# sourceMappingURL=adminGroupOpenPageCtrl.js.map