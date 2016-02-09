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
                header: "=",
                dscparams: "=",
                click: "&"
            };
        }
        CSRListDirective.prototype.compile = function () {
        };
        CSRListDirective.prototype.link = function (scope, element, attrs) {
            scope.styleFunction = function (key) {
                var returnClass = "";
                switch (key) {
                    case "title":
                        returnClass = "col-xs-8 col-sm-4";
                        break;
                    case "state":
                        returnClass = "col-xs-4 col-sm-2";
                        break;
                    case "description":
                        returnClass = "col-xs-12 col-sm-6";
                        break;
                }
                return returnClass + " cell " + key;
            };
            scope.openConfirm = function (row) {
                scope.$parent.$parent.vm.openConfirm(row);
            };
        };
        return CSRListDirective;
    })();
    CSRUI.CSRListDirective = CSRListDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);
//# sourceMappingURL=csrList.js.map