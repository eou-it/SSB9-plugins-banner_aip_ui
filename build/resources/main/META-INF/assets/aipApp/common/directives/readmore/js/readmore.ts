/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

module AIPUI {
    export function AIPReadmoreDirective($filter) {
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
          link:function(scope, elem, attr, ctrl, transclude)
          {
            transclude(scope, (clone) => {

            });
          },
          controller:function()
          {

          },
          readmore:function(str:string) {
                //TODO:: add "less" with clickable link
                return "";
            },
          readless:function(strr:string) {
                //TODO:: add "more" with clickable link
                return "";
            }
      }
  }
    angular.module('bannerAIPUI').directive('aipReadmore', [ '$filter',AIPReadmoreDirective]);

}
