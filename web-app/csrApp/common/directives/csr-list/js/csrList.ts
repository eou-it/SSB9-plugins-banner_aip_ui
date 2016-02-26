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
                itemtitle: "=?",
                description: "=?",
                header: "=",
                dscparams:"=",
                click:"&",
                stylefunction:"&"
            }
        }
        compile() {

        }
        link() {

        }
        controller($scope) {
            $scope.getStyle = function(key) {
                return $scope.stylefunction()(key);
            }
            $scope.openConfirm = function(row) {
                $scope.click()(row);
            }
        }

    }
}

register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);