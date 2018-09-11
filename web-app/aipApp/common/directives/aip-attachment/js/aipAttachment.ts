/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {

    export class AIPAttachment  {
        $inject = ["$scope"];
        templateUrl: string;
        restrict: string;
        scope: any;
        replace: boolean;
        constructor() {
            this.restrict = "AE";
            this.replace = false;
            this.scope = { }

        }

        compile() {

        }

        link(scope, elem, attr) {
            //console.log(scope.modalShown)
            scope.modalShown = attr.showModal;
        }

        controller($scope) {
            $scope.modalShown= false;


            $scope.openFileDialogOnEnter = function () {
                $scope.openFileDialog();
            };

            $scope.openFileDialog = function () {
                $("#file").click();
            };

            $scope.reset = function () {
                angular.element('#file-input-textbox').val("");
            };
            }
        }
    }

register("bannerAIPUI").directive("aipAttachment", AIPUI.AIPAttachment);
