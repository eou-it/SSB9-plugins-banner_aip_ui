///<reference path="../../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {
    export class AIPGroupDetailDirective {
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
                data: "="
            }
        }
        compile() {

        }
        link(scope, elem, attr, ctrl, transclude) {
            transclude(scope, (clone) => {

            });
        }
        controller($scope) {
            /*
            $scope.proceed = function() {
                $scope.next({groupId:this.groupId});
            }
            */
            $scope.getState = function(id) {
                //$scope.itemstate(id)
            }
            /*
            $scope.returnlist = function() {
                $scope.tolist();
            }
            */
            /*
            $scope.nextitem = function() {
                $scope.next({groupId:this.data.groupId, itemId:this.data.info.id});
            }
            */
        }

    }
}

register("bannerAIPUI").directive("aipGroupDetail", AIPUI.AIPGroupDetailDirective);