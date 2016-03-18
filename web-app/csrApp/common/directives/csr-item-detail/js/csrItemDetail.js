///<reference path="../../../../../typings/tsd.d.ts"/>
var CSRUI;
(function (CSRUI) {
    var CSRItemDetailDirective = (function () {
        function CSRItemDetailDirective() {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                data: "=",
                next: "&",
                tolist: "&"
            };
        }
        CSRItemDetailDirective.prototype.compile = function () {
        };
        CSRItemDetailDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            transclude(scope, function (clone) {
            });
        };
        CSRItemDetailDirective.prototype.controller = function ($scope) {
            $scope.proceed = function () {
                $scope.next();
            };
            $scope.getState = function (id) {
                //$scope.itemstate(id)
            };
            $scope.returnlist = function () {
                $scope.tolist();
            };
            $scope.nextitem = function () {
            };
        };
        return CSRItemDetailDirective;
    })();
    CSRUI.CSRItemDetailDirective = CSRItemDetailDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrItemDetail", CSRUI.CSRItemDetailDirective);
//# sourceMappingURL=csrItemDetail.js.map