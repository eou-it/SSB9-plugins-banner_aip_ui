///<reference path="../../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPStatusRuleDirective = (function () {
        function AIPStatusRuleDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                rules: "=",
                status: "=",
                inputs: "&"
            };
        }
        AIPStatusRuleDirective.prototype.compile = function () {
        };
        AIPStatusRuleDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            transclude(scope, function (clone) {
                scope.init();
            });
        };
        AIPStatusRuleDirective.prototype.controller = function ($scope) {
            $scope.init = function () {
                // $scope.addRule();
            };
            $scope.addRule = function () {
                $scope.rules.push({
                    statusName: "",
                    status: $scope.status[0]
                });
            };
            $scope.getState = function (id) {
                //$scope.itemstate(id)
            };
            $scope.moveUp = function (item) {
                if (!$scope.isFirst(item)) {
                    var idx = $scope.rules.indexOf(item);
                    var temp = $scope.rules[idx - 1];
                    $scope.rules[idx - 1] = item;
                    $scope.rules[idx] = temp;
                }
            };
            $scope.moveDown = function (item) {
                if (!$scope.isLast(item)) {
                    var idx = $scope.rules.indexOf(item);
                    var temp = $scope.rules[idx + 1];
                    $scope.rules[idx + 1] = item;
                    $scope.rules[idx] = temp;
                }
            };
            $scope.isLast = function (item) {
                if ($scope.rules.indexOf(item) === $scope.rules.length - 1) {
                    return true;
                }
                return false;
            };
            $scope.isFirst = function (item) {
                if ($scope.rules.indexOf(item) === 0) {
                    return true;
                }
                return false;
            };
            $scope.removeRule = function (item) {
                var idx = $scope.rules.indexOf(item);
                if (idx > -1) {
                    $scope.rules.splice(idx, 1);
                }
            };
        };
        return AIPStatusRuleDirective;
    })();
    AIPUI.AIPStatusRuleDirective = AIPStatusRuleDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipStatusRule", AIPUI.AIPStatusRuleDirective);
//# sourceMappingURL=statusRule.js.map