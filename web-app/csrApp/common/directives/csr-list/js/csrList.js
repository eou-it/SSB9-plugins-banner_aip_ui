///<reference path="../../../../../typings/tsd.d.ts"/>
var CSRUI;
(function (CSRUI) {
    var CSRListDirective = (function () {
        function CSRListDirective() {
            this.$inject = [];
            this.templateUrl = "../plugins/banner-csr-ui-1.0/csrApp/common/directives/csr-list/template/csrList.html";
            this.restrict = "AE";
            this.scope = {
                data: "=",
                itemtitle: "=?",
                description: "=?",
                header: "=",
                dscparams: "=",
                click: "&",
                stylefunction: "&",
                idx: "="
            };
        }
        CSRListDirective.prototype.compile = function () {
        };
        CSRListDirective.prototype.link = function (scope) {
            if (scope.idx === 0) {
                scope.isOpen = true;
            }
            else {
                scope.isOpen = false;
            }
        };
        CSRListDirective.prototype.controller = function ($scope) {
            $scope.getStyle = function (key) {
                return $scope.stylefunction()(key);
            };
            $scope.openConfirm = function (row) {
                $scope.click()(row);
            };
        };
        return CSRListDirective;
    })();
    CSRUI.CSRListDirective = CSRListDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);
//# sourceMappingURL=csrList.js.map