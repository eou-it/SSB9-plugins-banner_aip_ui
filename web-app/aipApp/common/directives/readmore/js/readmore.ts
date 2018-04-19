/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {
    export class AIPReadmoreDirective {
        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;
        transclude: boolean;
        constructor() {
            this.restrict = "A";
            this.replace = true;
            this.transclude = true;
            this.scope = {
                more: "@",
                less: "@",
                countby: "@",
                limit: "@",
                ellipsis: "@",
                text: "@",
                custom: "@"
            };
        }
        compile() {

        }
        link(scope, elem, attr, ctrl, transclude) {

            transclude(scope, (clone) => {

            });
        }
        controller() {

        }

        readmore(str:string) {
            //TODO:: add "less" with clickable link
            return "";
        }
        readless(strr:string) {
            //TODO:: add "more" with clickable link
            return "";
        }

    }
}

register("bannerAIPUI").directive("aipReadmore", AIPUI.AIPReadmoreDirective);
