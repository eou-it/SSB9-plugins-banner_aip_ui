///<reference path="../../../../../typings/tsd.d.ts"/>
var CSRUI;
(function (CSRUI) {
    var CSRReadmoreDirective = (function () {
        function CSRReadmoreDirective() {
            this.templateUrl = "../plugins/banner-csr-ui-1.0/csrApp/common/directives/csr-readmore/template/csrReadmore.html";
            this.restrict = "A";
            this.replace = true;
            this.transclude = true;
            this.scope = {
                more: "@",
                less: "@",
                countby: "@",
                limit: "@",
                ellipsis: "@",
                text: "@",
                custom: "@"
            };
        }
        CSRReadmoreDirective.prototype.compile = function () {
        };
        CSRReadmoreDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            var _this = this;
            var more = "<a class='read-more'>" + scope.more + "</a>";
            var less = "<a class='read-less'>" + scope.less + "</a>";
            var limit = scope.limit ? scope.limit : 200;
            attr.$observe("text", function (str) {
                _this.readmore(str);
            });
            transclude(scope.$parent, function (copy) {
                _this.readmore(copy.text().trim());
            });
        };
        CSRReadmoreDirective.prototype.controller = function () {
        };
        CSRReadmoreDirective.prototype.readmore = function (str) {
        };
        return CSRReadmoreDirective;
    })();
    CSRUI.CSRReadmoreDirective = CSRReadmoreDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrReadmore", CSRUI.CSRReadmoreDirective);
//# sourceMappingURL=csrReadmore.js.map