///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPItemDetailDirective = (function () {
        function AIPItemDetailDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                data: "=",
                next: "&",
                tolist: "&"
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
                $scope.next({ groupId: this.data.groupId, itemId: this.data.info.id });
            };
            $scope.getState = function (id) {
                //$scope.itemstate(id)
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
//# sourceMappingURL=itemDetail.js.map