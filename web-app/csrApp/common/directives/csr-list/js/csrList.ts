///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module CSRUI {
    export class CSRListDirective {

        $inject=[];
        templateUrl: string;
        restrict: string;
        scope:any;
        constructor() {
            this.templateUrl = "../plugins/banner-csr-ui-1.0/csrApp/common/directives/csr-list/template/csrList.html";
            this.restrict = "AE";
            this.scope = {
                data: "=",
                title: "=?",
                description: "=?",
                header: "="
            }
        }
        compile() {

        }
        link(scope, element, attrs) {

        }


    }
}

register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);