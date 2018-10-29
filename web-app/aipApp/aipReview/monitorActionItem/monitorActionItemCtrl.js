/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
///<reference path="../../common/services/userService.ts"/>
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
            this.actionItemNamesList = [];
            this.personId;
            this.personName;
            this.selected;
            this.option;
            this.init();
        }
        MonitorActionItemCtrl.prototype.init = function () {
            var _this = this;
            var allPromises = [];
            allPromises.push(this.aipReviewService.getActionItemList()
                .then(function (response) {
                _this.actionItemNamesList = response.data;
            }));
        };
        MonitorActionItemCtrl.prototype.search = function () {
            console.log(this.personId);
            console.log(this.personName);
            console.log(this.selected.id);
            console.log(this.option);
        };
        MonitorActionItemCtrl.prototype.reset = function () {
            this.selected = "";
            this.option = "";
            this.personId = "";
            this.personName = "";
        };
        MonitorActionItemCtrl.prototype.review = function (userActionItemID) {
            this.$state.go("review-action-item", { userActionItemID: userActionItemID });
        };
        return MonitorActionItemCtrl;
    }());
    AIP.MonitorActionItemCtrl = MonitorActionItemCtrl;
})(AIP || (AIP = {}));
register("bannerAIPReview").controller("monitorActionItemCtrl", AIP.MonitorActionItemCtrl);
