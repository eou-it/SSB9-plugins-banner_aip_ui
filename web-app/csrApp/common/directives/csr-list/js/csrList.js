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
                title: "=?",
                description: "=?",
                header: "="
            };
        }
        CSRListDirective.prototype.compile = function () {
        };
        CSRListDirective.prototype.link = function (scope, element, attrs) {
        };
        return CSRListDirective;
    })();
    CSRUI.CSRListDirective = CSRListDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);
//# sourceMappingURL=csrList.js.map