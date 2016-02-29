///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var SpinnerService = (function () {
        function SpinnerService() {
            this.showing = true;
        }
        SpinnerService.prototype.showSpinner = function (show) {
            if (angular.isUndefined(show)) {
                show = true;
            }
            this.showing = show;
        };
        SpinnerService.$inject = [];
        return SpinnerService;
    })();
    CSR.SpinnerService = SpinnerService;
})(CSR || (CSR = {}));
register("bannercsr").service("SpinnerService", CSR.SpinnerService);
//# sourceMappingURL=csrSpinnerService.js.map