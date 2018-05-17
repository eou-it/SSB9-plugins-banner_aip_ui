/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPItemDetailDirective = /** @class */ (function () {
        function AIPItemDetailDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = false;
            this.scope = {
                data: "=",
                next: "&",
                tolist: "&",
                custompage: "&"
            };
        }
        AIPItemDetailDirective.prototype.compile = function () {
        };
        AIPItemDetailDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            transclude(scope, function (clone) {
            });
        };
        AIPItemDetailDirective.prototype.controller = function ($scope) {
            $scope.proceed = function () {
                $scope.next({ groupId: this.data.info.detailId, itemId: this.data.info.id });
            };
            $scope.getState = function (id) {
                $scope.itemstate(id);
            };
            $scope.returnlist = function () {
                $scope.tolist();
            };
            $scope.nextitem = function () {
                $scope.next({ groupId: this.data.groupId, itemId: this.data.info.id });
            };
        };
        return AIPItemDetailDirective;
    }());
    AIPUI.AIPItemDetailDirective = AIPItemDetailDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipItemDetail", AIPUI.AIPItemDetailDirective);
