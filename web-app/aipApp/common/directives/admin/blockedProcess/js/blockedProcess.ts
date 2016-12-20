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
                generated: "=",
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
                $scope.current = getCurrent();
                $scope.generated.push($scope.current);
            }

            $scope.availableItems = function() {
                var available = [];
                available.push(getCurrent());
                var generated = $scope.generated.map((item) => {
                    return item.name;
                });
                angular.forEach($scope.all, item => {
                    if(generated.indexOf(item.name)===-1) {
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
                return current.value.urls;
            }
            $scope.remove = function() {
                $scope.selected.splice($scope.selected.indexOf($scope.currentitem),1);
                $scope.generated.splice($scope.generated.indexOf($scope.currenitem),1);
            }
            var getCurrent = function() {
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

register("bannerAIPUI").directive("aipBlockedProcess", AIPUI.AIPBlockedProcessDirective);