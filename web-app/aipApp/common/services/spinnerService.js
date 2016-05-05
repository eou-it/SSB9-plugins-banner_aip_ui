///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var SpinnerService = (function () {
        function SpinnerService() {
            this.showing = false;
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
    AIP.SpinnerService = SpinnerService;
})(AIP || (AIP = {}));
register("bannerAIP").service("SpinnerService", AIP.SpinnerService);
//# sourceMappingURL=spinnerService.js.map