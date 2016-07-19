///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupOpenPageCtrl = (function () {
        function AdminGroupOpenPageCtrl($scope, AdminGroupService, $q, SpinnerService, $state, $filter) {
            this.$inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter"];
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            $scope.$watch("[vm.groupDetailResponse]", function (newVal, oldVal) {
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
            this.groupDetail = {};
            if (this.$state.params.grp) {
                this.displayGroup();
            }
            /*
            promises.push(
                this.adminGroupService.getGroupDetail(this.$state.params.grp.groupId).then((status) => {
                })
            );
            */
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminGroupOpenPageCtrl.prototype.displayGroup = function () {
            console.log(this.$state.params.grp);
            $("#title-panel h1").html(this.$state.params.grp.title);
        };
        return AdminGroupOpenPageCtrl;
    })();
    AIP.AdminGroupOpenPageCtrl = AdminGroupOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
//# sourceMappingURL=adminGroupOpenPageCtrl.js.map