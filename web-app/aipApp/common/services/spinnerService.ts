///<reference path="../../../typings/tsd.d.ts"/>
declare var register;

module AIP {
    export class SpinnerService {
        static $inject = [];
        showing:boolean;

        constructor() {
            this.showing = false;
        }
        showSpinner(show) {
            if(angular.isUndefined(show)) {
                show = true;
            }
            this.showing = show;
        }
    }
}

register("bannerAIP").service("SpinnerService", AIP.SpinnerService);