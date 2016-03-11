///<reference path="../../../../../typings/tsd.d.ts"/>
var CSRUI;
(function (CSRUI) {
    var CSRReadmoreDirective = (function () {
        function CSRReadmoreDirective() {
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
            transclude(scope, function (clone) {
            });
        };
        CSRReadmoreDirective.prototype.controller = function () {
        };
        CSRReadmoreDirective.prototype.readmore = function (str) {
            var original = this.scope.text;
            var moreText = "";
            //TODO:: add "less" with clickable link
            return moreText;
        };
        CSRReadmoreDirective.prototype.readless = function (strr) {
            var original = this.scope.text;
            var lessText = "";
            //TODO:: add "more" with clickable link
            return lessText;
        };
        return CSRReadmoreDirective;
    })();
    CSRUI.CSRReadmoreDirective = CSRReadmoreDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrReadmore", CSRUI.CSRReadmoreDirective);
//# sourceMappingURL=csrReadmore.js.map