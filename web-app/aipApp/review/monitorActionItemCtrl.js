///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../common/services/aipReviewService.ts"/>
///<reference path="../common/services/userService.ts"/>
var AIP;
(function (AIP) {
    var MonitorActionItemCtrl = /** @class */ (function () {
        function MonitorActionItemCtrl($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce) {
            this.$inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce"];
            $scope.vm = this;
            this.$state = $state;
            this.aipReviewService = AIPReviewService;
            this.userService = AIPUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.APP_ROOT = APP_ROOT;
            this.$sce = $sce;
            this.init();
        }
        MonitorActionItemCtrl.prototype.init = function () {
            //TODO: Get list of Action items for Search Parameter - Action Item - LOV
        };
        return MonitorActionItemCtrl;
    }());
    AIP.MonitorActionItemCtrl = MonitorActionItemCtrl;
})(AIP || (AIP = {}));
register("bannerAIPReview").controller("monitorActionItemCtrl", AIP.MonitorActionItemCtrl);
