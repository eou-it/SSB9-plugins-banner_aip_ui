///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemOpenPageCtrl = (function () {
        function AdminActionItemOpenPageCtrl($scope, $q, $state, $filter, $sce, SpinnerService, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$sce", "SpinnerService", "AdminActionService"];
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.adminActionService = AdminActionService;
            this.spinnerService = SpinnerService;
            this.actionItem = {};
            this.init();
        }
        AdminActionItemOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
                $("#title-panel h1").html(_this.actionItem.actionItemName);
                $("p.openActionItemTitle").html(_this.actionItem.actionItemName);
                $("p.openActionItemFolder").html(_this.actionItem.folderName);
                $("p.openActionItemStatus").html(_this.actionItem.actionItemStatus);
                $("p.openActionItemDesc").html(_this.actionItem.actionItemDesc);
                $("p.openActionItemActivityDate").html(_this.actionItem.actionItemActivityDate);
                $("p.openActionItemLastUpdatedBy").html(_this.actionItem.actionItemUserId);
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
        AdminActionItemOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var data = noti.data.newActionItem;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
        };
        return AdminActionItemOpenPageCtrl;
    }());
    AIP.AdminActionItemOpenPageCtrl = AdminActionItemOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
//# sourceMappingURL=adminActionItemOpenPageCtrl.js.map