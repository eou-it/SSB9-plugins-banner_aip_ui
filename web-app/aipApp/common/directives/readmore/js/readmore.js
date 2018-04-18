/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPReadmoreDirective = (function () {
        function AIPReadmoreDirective() {
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
        AIPReadmoreDirective.prototype.compile = function () {
        };
        AIPReadmoreDirective.prototype.link = function (scope, elem, attr, ctrl, transclude) {
            transclude(scope, function (clone) {
            });
        };
        AIPReadmoreDirective.prototype.controller = function () {
        };
        AIPReadmoreDirective.prototype.readmore = function (str) {
            var moreText = "";
            //TODO:: add "less" with clickable link
            return moreText;
        };
        AIPReadmoreDirective.prototype.readless = function (strr) {
            var lessText = "";
            //TODO:: add "more" with clickable link
            return lessText;
        };
        return AIPReadmoreDirective;
    }());
    AIPUI.AIPReadmoreDirective = AIPReadmoreDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipReadmore", AIPUI.AIPReadmoreDirective);
