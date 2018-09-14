/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {

    export class AIPAttachment  {
        static $inject=["AIPUploadService"];
        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;
        attachmentParams;

        constructor() {
            this.restrict = "AE";
            this.replace = false;
            this.scope = {
                showModal:"="
            }
            this.attachmentParams = {};

        }

        compile() {

        }

        link(scope, elem, attr) {
        }

        controller($scope,AIPUploadService) {

            $scope.$watch(
                "showModal", function (newVal, oldVal) {
                    console.log("Value changed "+ newVal);
                    //TODO: Get the new Response ID & refresh the grid.
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            );


            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };

            $scope.submitUpload = function (selectedFile) {
                if(selectedFile){
                    this.attachmentParams={actionItemId:218,responseId:391,documentName:'testfile',fileLocation:'AIP',file:selectedFile[0]};
                    //TODO need to work on getting params data
                    AIPUploadService.saveUploadInfo(this.attachmentParams);
                }

            };
        }

    }
}

register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
