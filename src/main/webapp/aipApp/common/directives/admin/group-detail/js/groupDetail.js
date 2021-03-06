/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPGroupDetailDirective = (function () {
        function AIPGroupDetailDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                data: "="
            };
        }
        AIPGroupDetailDirective.prototype.compile = function () {
        };
        AIPGroupDetailDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            transclude(scope, function (clone) {
            });
        };
        AIPGroupDetailDirective.prototype.controller = function ($scope) {
            $scope.getState = function (id) {
            };
        };
        return AIPGroupDetailDirective;
    })();
    AIPUI.AIPGroupDetailDirective = AIPGroupDetailDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipGroupDetail", AIPUI.AIPGroupDetailDirective);
//# sourceMappingURL=groupDetail.js.map