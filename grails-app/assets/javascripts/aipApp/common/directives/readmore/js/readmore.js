/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    function AIPReadmoreDirective($filter) {
        return {
            restrict: "A",
            replace: true,
            transclude: true,
            scope: {
                more: "@",
                less: "@",
                countby: "@",
                limit: "@",
                ellipsis: "@",
                text: "@",
                custom: "@"
            },
            link: function (scope, elem, attr, ctrl, transclude) {
                transclude(scope, function (clone) {
                });
            },
            controller: function () {
            },
            readmore: function (str) {
                //TODO:: add "less" with clickable link
                return "";
            },
            readless: function (strr) {
                //TODO:: add "more" with clickable link
                return "";
            }
        };
    }
    AIPUI.AIPReadmoreDirective = AIPReadmoreDirective;
    angular.module('bannerAIPUI').directive('aipReadmore', ['$filter', AIPReadmoreDirective]);
})(AIPUI || (AIPUI = {}));
