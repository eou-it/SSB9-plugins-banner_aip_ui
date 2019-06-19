/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
            $scope.getState = function(id) {
            }
        }

    }
}

angular.module("bannerAIPUI").directive("aipGroupDetail", AIPUI.AIPGroupDetailDirective);
