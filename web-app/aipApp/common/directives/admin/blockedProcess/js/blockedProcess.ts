///<reference path="../../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {

    export class AIPBlockedProcessDirective {
        templateUrl: string;
        restrict: string;
        scope:any;
        transclude: boolean;
        replace: boolean;
        // current: {};
        constructor() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            // this.current = {};
            this.scope = {
                currentitem: "=",
                selected: "=",
                all: "="
            }
        }
        compile() {

        }
        link(scope, elem, attr, ctrl, transclude) {
            // transclude(scope, (clone) => {
            //
            //     scope.init();
            //
            // });
            scope.init();
        }
        controller($scope) {

            $scope.init = function(){
                var available = this.availableItems();
                $scope.current = available[0];
            }

            $scope.availableItems = function() {
                var available = [];
                available.push(getCurrent());
                var selected = $scope.selected.map((item) => {
                    return item.code;
                });
                angular.forEach($scope.all, item => {
                    if(selected.indexOf(item.code)===-1) {
                        available.push(item);
                    }
                });
                return available;
            }
            $scope.updateCurrent = function() {
                $scope.remove() //remove current item item from selected list
                $scope.selected.push($scope.current);   //add newly selected item to selected list
                $scope.currentitem = $scope.current;
            }
            $scope.getCurrentUrls = function() {
                var current = getCurrent();
                return current.urls;
            }
            $scope.remove = function() {
                $scope.selected.splice($scope.selected.indexOf($scope.currentitem),1);
            }
            var getCurrent = function() {
                var current = $scope.all.filter((item) => {
                    if(item.code === $scope.currentitem.code) {
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

register("bannerAIPUI").directive("aipBlockedProcess", AIPUI.AIPBlockedProcessDirective);