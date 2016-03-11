///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;
declare var csrAppRoot;

module CSRUI {
    export class CSRListDirective {

        templateUrl: string;
        restrict: string;
        scope:any;
        constructor() {
            this.restrict = "AE";
            this.scope = {
                data: "=",
                itemtitle: "=?",
                description: "=?",
                header: "=",
                dscparams:"=",
                click:"&",
                stylefunction:"&",
                idx: "="
            }
        }
        compile() {

        }
        link(scope) {
            if (scope.idx === 0) {
                scope.isOpen = true;
            } else {
                scope.isOpen = false;
            }
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