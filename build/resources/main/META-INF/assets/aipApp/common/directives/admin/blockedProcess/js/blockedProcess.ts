/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {

    export class AIPBlockedProcessDirective {
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
                currentitem: "=",
                selected: "=",
                generated: "=",
                all: "="
            }
        }
        compile() {

        }
        link(scope, elem, attr, ctrl, transclude) {
            scope.init();
        }
        controller($scope) {

            $scope.init = function(){
                var generated = $scope.generated.filter((item) => {
                    return item.name === $scope.currentitem.name;
                });
                $scope.current = $scope.getCurrent();
                if(generated.length === 0) {

                    $scope.generated.push($scope.currentitem);
                    $scope.urls = $scope.getCurrentUrls();
                }
            };

            $scope.updateCurrent = function() {
                // $scope.remove() //remove current item item from selected list
                var selected = $scope.selected.filter((item) => {
                    return item.name === $scope.current.name;
                });
                $scope.selected[$scope.selected.indexOf(selected[0])] = $scope.currentitem;
                // $scope.selected.push($scope.currentitem);   //add newly selected item to selected list
                // $scope.generated.push($scope.currentitem);
                // $scope.current = $scope.currentitem;
                var generated = $scope.generated.filter((item) => {
                    return item.name === $scope.current.name;
                });
                $scope.generated[$scope.generated.indexOf(generated[0])] = $scope.currentitem;
                $scope.current = $scope.currentitem;
                $scope.urls = $scope.getCurrentUrls();
            };
            $scope.getCurrentUrls = function() {
                var current = $scope.getCurrent();
                return current.value.urls;
            };
            $scope.remove = function() {
                var selected = $scope.selected.filter((item) => {
                    return item.name === $scope.current.name;
                });
                $scope.selected.splice($scope.selected.indexOf(selected[0]),1);

                var generated = $scope.generated.filter((item) => {
                    return item.name === $scope.current.name;
                });
                $scope.generated.splice($scope.generated.indexOf(generated[0]),1);
            }
            $scope.getCurrent = function() {
                var current = $scope.all.filter((item) => {
                    if(item.name === $scope.currentitem.name) {
                        return item;
                    }
                });
                if(current.length===0) {
                    throw Error("No current select value. Error");
                }
                return current[0];
            }


        }

    }
}

angular.module("bannerAIPUI").directive("aipBlockedProcess", AIPUI.AIPBlockedProcessDirective);
