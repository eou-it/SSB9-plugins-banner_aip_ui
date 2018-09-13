/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPAttachment = (function () {
        function AIPAttachment() {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {
                showModal: "="
            };
        }
        AIPAttachment.prototype.compile = function () {
        };
        AIPAttachment.prototype.link = function (scope, elem, attr) {
        };
        AIPAttachment.prototype.controller = function ($scope) {
            $scope.$watch("showModal", function (newVal, oldVal) {
                console.log("Value changed " + newVal);
                //TODO: Get the new Response ID & refresh the grid.
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };
        };
        return AIPAttachment;
    })();
    AIPUI.AIPAttachment = AIPAttachment;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
//# sourceMappingURL=aipAttachment.js.map