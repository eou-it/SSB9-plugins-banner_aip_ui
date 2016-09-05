///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemOpenPageCtrl = (function () {
        function AdminActionItemOpenPageCtrl($scope, $q, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile, SpinnerService, AdminActionService, APP_ROOT) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
                "SpinnerService", "AdminActionService", "APP_ROOT"];
            $scope.vm = this;
            this.scope = $scope;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.$window = $window;
            this.$templateRequest = $templateRequest;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.adminActionService = AdminActionService;
            this.spinnerService = SpinnerService;
            this.APP_ROOT = APP_ROOT;
            this.actionItem = {};
            this.isAssigned = false;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
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
                // $(".actionItemOpenContainer").height(this.getHeight());
            }, function (err) {
                console.log(err);
            });
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
                var actionItemFolder = $("#actionItemTemplate");
                if (actionItemFolder) {
                    actionItemFolder.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity,
                        placeholderOption: "first"
                    });
                }
            });
        };
        AdminActionItemOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var data = noti.data.newActionItem;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.action.add.success"),
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
        AdminActionItemOpenPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() - 30;
            return { height: containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.getSaparatorHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $(".xe-tab-container").height() -
                $("#outerFooter").height() - 30;
            return { height: containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.openOverviewPanel = function () {
            return this.openPanel("overview");
        };
        AdminActionItemOpenPageCtrl.prototype.openContentPanel = function () {
            return this.openPanel("content");
        };
        AdminActionItemOpenPageCtrl.prototype.openPanel = function (panelName) {
            var _this = this;
            var deferred = this.$q.defer();
            var url = "";
            switch (panelName) {
                case "overview":
                    url = this.APP_ROOT + "admin/action/open/overview/adminActionItemOpenOverview.html";
                    break;
                case "content":
                    url = this.APP_ROOT + "admin/action/open/content/adminActionItemOpenContent.html";
                    break;
                default:
                    break;
            }
            var templateUrl = this.$sce.getTrustedResourceUrl(url);
            this.$templateRequest(templateUrl)
                .then(function (template) {
                var compiled = _this.$compile(template)(_this.scope);
                deferred.resolve(compiled);
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.isNoContent = function () {
            return true;
        };
        return AdminActionItemOpenPageCtrl;
    }());
    AIP.AdminActionItemOpenPageCtrl = AdminActionItemOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
//# sourceMappingURL=adminActionItemOpenPageCtrl.js.map