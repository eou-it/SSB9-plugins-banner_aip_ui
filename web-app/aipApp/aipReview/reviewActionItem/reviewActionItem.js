/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
var AIP;
(function (AIP) {
    var ReviewActionItemCtrl = /** @class */ (function () {
        function ReviewActionItemCtrl($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce) {
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
            this.actionItemNamesList = [];
            this.personId;
            this.personName;
            this.selected;
            this.option;
        }
        return ReviewActionItemCtrl;
    }());
    AIP.ReviewActionItemCtrl = ReviewActionItemCtrl;
})(AIP || (AIP = {}));
register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
