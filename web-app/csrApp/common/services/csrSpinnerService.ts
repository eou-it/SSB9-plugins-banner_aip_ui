///<reference path="../../../typings/tsd.d.ts"/>
declare var register;

module CSR {
    export class SpinnerService {
        static $inject = [];
        showing:boolean;

        constructor() {
            this.showing = true;
        }
        showSpinner(show) {
            if(angular.isUndefined(show)) {
                show = true;
            }
            this.showing = show;
        }
    }
}

register("bannercsr").service("SpinnerService", CSR.SpinnerService);