/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPBlockedProcessDirective = (function () {
        function AIPBlockedProcessDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
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
            scope.init();
        };
        AIPBlockedProcessDirective.prototype.controller = function ($scope) {
            $scope.init = function () {
                var generated = $scope.generated.filter(function (item) {
                    return item.name === $scope.currentitem.name;
                });
                $scope.current = $scope.getCurrent();
                if (generated.length === 0) {
                    $scope.generated.push($scope.currentitem);
                    $scope.urls = $scope.getCurrentUrls();
                }
            };
            $scope.updateCurrent = function () {
                // $scope.remove() //remove current item item from selected list
                var selected = $scope.selected.filter(function (item) {
                    return item.name === $scope.current.name;
                });
                $scope.selected[$scope.selected.indexOf(selected[0])] = $scope.currentitem;
                // $scope.selected.push($scope.currentitem);   //add newly selected item to selected list
                // $scope.generated.push($scope.currentitem);
                // $scope.current = $scope.currentitem;
                var generated = $scope.generated.filter(function (item) {
                    return item.name === $scope.current.name;
                });
                $scope.generated[$scope.generated.indexOf(generated[0])] = $scope.currentitem;
                $scope.current = $scope.currentitem;
                $scope.urls = $scope.getCurrentUrls();
            };
            $scope.getCurrentUrls = function () {
                var current = $scope.getCurrent();
                return current.value.urls;
            };
            $scope.remove = function () {
                var selected = $scope.selected.filter(function (item) {
                    return item.name === $scope.current.name;
                });
                $scope.selected.splice($scope.selected.indexOf(selected[0]), 1);
                var generated = $scope.generated.filter(function (item) {
                    return item.name === $scope.current.name;
                });
                $scope.generated.splice($scope.generated.indexOf(generated[0]), 1);
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
    })();
    AIPUI.AIPBlockedProcessDirective = AIPBlockedProcessDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipBlockedProcess", AIPUI.AIPBlockedProcessDirective);
//# sourceMappingURL=blockedProcess.js.map