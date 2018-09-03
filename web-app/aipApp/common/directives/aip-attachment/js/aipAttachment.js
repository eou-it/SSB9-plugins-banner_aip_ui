/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPAttachment = /** @class */ (function () {
        function AIPAttachment() {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {};
        }
        AIPAttachment.prototype.compile = function () {
        };
        AIPAttachment.prototype.link = function (scope, elem, attr) {
        };
        AIPAttachment.prototype.controller = function ($scope) {
            $scope.openFileDialog = function () {
                $("#file").click();
            };
            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };
        };
        return AIPAttachment;
    }());
    AIPUI.AIPAttachment = AIPAttachment;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
