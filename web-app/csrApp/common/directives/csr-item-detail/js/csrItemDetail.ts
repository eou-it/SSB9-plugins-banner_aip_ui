///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module CSRUI {
    export class CSRItemDetailDirective {

        templateUrl: string;
        restrict: string;
        scope:any;
        transclude: boolean;
        replace: boolean;
        constructor() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                data: "=",
                next: "&"
            }
        }
        compile() {

        }
        link(scope, elem, attr, ctrl, transclude) {
            transclude(scope, (clone) => {

            });
        }
        controller($scope) {
            $scope.proceed = function() {
                $scope.next();
            }
            $scope.getState = function(id) {
                //$scope.itemstate(id)
            }
        }

    }
}

register("bannercsrui").directive("csrItemDetail", CSRUI.CSRItemDetailDirective);