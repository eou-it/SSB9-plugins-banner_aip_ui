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
                $scope.current = $scope.getCurrent();
                $scope.generated.push($scope.currentitem);
                $scope.urls = $scope.getCurrentUrls();
            }

            // $scope.availableItems = function() {
            //     var available = [];
            //     // available.push($scope.getCurrent());
            //     var generated = $scope.generated.map((item) => {
            //         return item.name;
            //     });
            //     angular.forEach($scope.all, item => {
            //         if(generated.indexOf(item.name)===-1 && available.indexOf(item.name)===-1) {
            //             available.push(item);
            //         }
            //     });
            //     if(available.indexOf($scope.currentitem)===-1) {
            //         available.unshift($scope.currentitem);
            //     }
            //     return available;
            // }
            $scope.updateCurrent = function() {
                $scope.remove() //remove current item item from selected list
                $scope.selected.push($scope.currentitem);   //add newly selected item to selected list
                // $scope.generated.push($scope.currentitem);
                // $scope.current = $scope.currentitem;
            }
            $scope.getCurrentUrls = function() {
                var current = $scope.getCurrent();
                return current.value.urls;
            }
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

register("bannerAIPUI").directive("aipBlockedProcess", AIPUI.AIPBlockedProcessDirective);