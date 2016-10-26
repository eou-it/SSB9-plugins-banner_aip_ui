///<reference path="../../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {
    export class AIPStatusRuleDirective {
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
                inputs:"&"
            }
        }
        compile() {

        }
        link(scope, elem, attr, ctrl, transclude) {
            transclude(scope, (clone) => {

            });
        }
        controller($scope) {
            $scope.inputs = [];

            $scope.addRule=function(){
                $scope.inputs.push({})
                console.log($scope.inputs)
            }
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

register("bannerAIPUI").directive("aipStatusRule", AIPUI.AIPStatusRuleDirective);