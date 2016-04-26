///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var SpinnerCtrl = (function () {
        function SpinnerCtrl($scope, SpinnerService, $rootScope) {
            var _this = this;
            $scope.vm = this;
            this.spinnerService = SpinnerService;
            this.showing = this.spinnerService.showing;
            $rootScope.$watch(function () {
                return _this.spinnerService.showing;
            }, function (newVal) {
                _this.showing = newVal;
            }, true);
        }
        SpinnerCtrl.$inject = ["$scope", "SpinnerService", "$rootScope"];
        return SpinnerCtrl;
    })();
    AIP.SpinnerCtrl = SpinnerCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("SpinnerCtrl", AIP.SpinnerCtrl);
//# sourceMappingURL=spinnerCtrl.js.map