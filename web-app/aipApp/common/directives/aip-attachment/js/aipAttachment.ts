/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {
    export class AIPAttachment {

        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;


        constructor() {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {}
        }

        compile() {

        }

        link(scope, elem, attr) {

        }

        controller($scope) {
        }
    }
}

register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
