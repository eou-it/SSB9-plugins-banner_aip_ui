/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {
    export class AIPItemDetailDirective {

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
                next: "&",
                tolist: "&",
                custompage: "&"
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
               // console.log("data from item detail")
               // console.log(this.data);
                //this.data.info.id=111;
                $scope.next({groupId:this.data.info.detailId, itemId:this.data.info.id});
            }
            $scope.getState = function(id) {
                $scope.itemstate(id)
            }
            $scope.returnlist = function() {
                $scope.tolist();
            }
            $scope.nextitem = function() {
                $scope.next({groupId:this.data.groupId, itemId:this.data.info.id});
            }
        }

    }
}

register("bannerAIPUI").directive("aipItemDetail", AIPUI.AIPItemDetailDirective);
