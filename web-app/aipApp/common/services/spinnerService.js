/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var SpinnerService = /** @class */ (function () {
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
    }());
    AIP.SpinnerService = SpinnerService;
})(AIP || (AIP = {}));
register("bannerCommonAIP").service("SpinnerService", AIP.SpinnerService);
