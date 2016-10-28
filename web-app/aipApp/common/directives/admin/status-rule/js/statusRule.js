///<reference path="../../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPStatusRuleDirective = (function () {
        function AIPStatusRuleDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                data: "=",
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
                $scope.addRule();
            };
            $scope.inputs = [];
            $scope.addRule = function () {
                $scope.inputs.push({});
                console.log($scope.inputs);
            };
            $scope.getState = function (id) {
                //$scope.itemstate(id)
            };
        };
        return AIPStatusRuleDirective;
    }());
    AIPUI.AIPStatusRuleDirective = AIPStatusRuleDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipStatusRule", AIPUI.AIPStatusRuleDirective);
//# sourceMappingURL=statusRule.js.map