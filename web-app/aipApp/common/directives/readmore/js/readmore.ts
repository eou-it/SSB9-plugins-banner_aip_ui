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
            var original = this.scope.text;
            var moreText = "";
            //TODO:: add "less" with clickable link
            return moreText;
        }
        readless(strr:string) {
            var original = this.scope.text;
            var lessText = "";
            //TODO:: add "more" with clickable link
            return lessText;
        }

    }
}

register("bannerAIPUI").directive("aipReadmore", AIPUI.AIPReadmoreDirective);
