///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var SpinnerCtrl = (function () {
        function SpinnerCtrl($scope, SpinnerService, $rootScope) {
            var _this = this;
            $scope.vm = this;
            this.spinnerService = SpinnerService;
            this.showing = SpinnerService.showing;
            $rootScope.$watch(function () {
                return _this.spinnerService.showing;
            }, function (newVal) {
                _this.showing = newVal;
            }, true);
        }
        SpinnerCtrl.$inject = ["$scope", "SpinnerService", "$rootScope"];
        return SpinnerCtrl;
    })();
    CSR.SpinnerCtrl = SpinnerCtrl;
})(CSR || (CSR = {}));
register("bannercsr").controller("SpinnerCtrl", CSR.SpinnerCtrl);
//# sourceMappingURL=csrSpinnerCtrl.js.map