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
            scope.styleFunction = function(key) {
                var returnClass = "";
                switch(key) {
                    case "title":
                        returnClass = "col-xs-9 col-sm-4";
                        break;
                    case "state":
                        returnClass = "col-xs-3 col-sm-2";
                        break;
                    case "description":
                        returnClass = "col-xs-12 col-sm-6";
                        break;
                }
                return  returnClass + " cell " + key;
            }
            scope.confirm = function(row) {
                console.log(row);
            }
        }


    }
}

register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);