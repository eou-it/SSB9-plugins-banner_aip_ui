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
            this.attachmentParams = {};
        }
        AIPAttachment.prototype.compile = function () {
        };
        AIPAttachment.prototype.link = function (scope, elem, attr) {
        };
        AIPAttachment.prototype.controller = function ($scope, AIPUploadService) {
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
            $scope.submitUpload = function (selectedFile) {
                this.attachmentParams = { actionItemId: 218, responseId: 391, documentName: 'testfile', file: selectedFile };
                //TODO need to work on getting params data
                AIPUploadService.saveUploadInfo(this.attachmentParams).then(function (response) {
                    console.log("response" + response);
                });
            };
        };
        AIPAttachment.$inject = ["AIPUploadService"];
        return AIPAttachment;
    })();
    AIPUI.AIPAttachment = AIPAttachment;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
//# sourceMappingURL=aipAttachment.js.map