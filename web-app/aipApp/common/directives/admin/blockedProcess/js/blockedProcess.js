///<reference path="../../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPBlockedProcessDirective = (function () {
        // current: {};
        function AIPBlockedProcessDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            // this.current = {};
            this.scope = {
                currentitem: "=",
                selected: "=",
                generated: "=",
                all: "="
            };
        }
        AIPBlockedProcessDirective.prototype.compile = function () {
        };
        AIPBlockedProcessDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            // transclude(scope, (clone) => {
            //
            //     scope.init();
            //
            // });
            scope.init();
        };
        AIPBlockedProcessDirective.prototype.controller = function ($scope) {
            $scope.init = function () {
                // $scope.current = $scope.getCurrent();
                $scope.generated.push($scope.currentitem);
                $scope.urls = $scope.getCurrentUrls();
            };
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
            $scope.updateCurrent = function (item) {
                console.log(item);
                /*$scope.remove() //remove current item item from selected list
                $scope.selected.push(item);   //add newly selected item to selected list
                $scope.currentitem = item;*/
            };
            $scope.getCurrentUrls = function () {
                var current = $scope.getCurrent();
                return current.value.urls;
            };
            $scope.remove = function () {
                $scope.selected.splice($scope.selected.indexOf($scope.currentitem), 1);
                $scope.generated.splice($scope.generated.indexOf($scope.currentitem), 1);
            };
            $scope.getCurrent = function () {
                var current = $scope.all.filter(function (item) {
                    if (item.name === $scope.currentitem.name) {
                        return item;
                    }
                });
                if (current.length === 0) {
                    throw Error("No current select value. Error");
                }
                return current[0];
            };
        };
        return AIPBlockedProcessDirective;
    }());
    AIPUI.AIPBlockedProcessDirective = AIPBlockedProcessDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipBlockedProcess", AIPUI.AIPBlockedProcessDirective);
//# sourceMappingURL=blockedProcess.js.map