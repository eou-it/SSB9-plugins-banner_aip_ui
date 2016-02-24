///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module CSRUI {
    export class CSRReadmoreDirective {
        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;
        transclude: boolean;
        constructor() {
            this.templateUrl = "../plugins/banner-csr-ui-1.0/csrApp/common/directives/csr-readmore/template/csrReadmore.html";
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
            var more = "<a class='read-more'>"+scope.more+"</a>";
            var less = "<a class='read-less'>"+scope.less+"</a>";
            var limit = scope.limit?scope.limit:200;

            attr.$observe("text", (str) => {
                this.readmore(str);
            });
            transclude(scope.$parent, (copy) => {
                this.readmore(copy.text().trim());
            });
        }
        controller() {

        }

        readmore(str: string) {

        }

    }
}

register("bannercsrui").directive("csrReadmore", CSRUI.CSRReadmoreDirective);