/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;
//var CustomPageController;
declare var CustomPageController;

declare var params;
module PB {
    export function PageBuilderPage($compile,ItemListViewService) {
           return {
            restrict: "AE",
            replace: false,
            transclude: true,
            $compile:$compile,
            ItemListViewService:ItemListViewService,
            scope: {
                content:"@",
                aid: "@",
                gid: "@",
                page: "@"
            },
            link:function(scope, element, attrs)
            {
                var self = this;

                scope.getPagebuilderDetails = function (tpl) {
                    self.ItemListViewService.getPagebuilderPage(attrs.page, attrs.aid, attrs.gid)
                        .then((val) => {
                            element.children().empty();
                            var tempElement = angular.element(val.html);

                            var bodyContent = tempElement.filter("div.customPage").attr("id", "PBContent");

                            var aipController = {};
                            var pbController = "CustomPageController_" + attrs.page;
                            var appModule = appModule || angular.module('BannerOnAngular');

                            appModule.requires.push('ngResource', 'ngGrid', 'ui', 'pbrun.directives', 'ngSanitize', 'xe-ui-components');

                            /* disable debug: */
                            appModule.config(['$compileProvider', function ($compileProvider) {
                                $compileProvider.debugInfoEnabled(false);
                            }]);

                            if (window[pbController]) { // backwards compatible with alpha release
                                aipController[pbController] = window[pbController];
                            }

                            for (var pc in aipController) {
                                if (aipController.hasOwnProperty(pc)) {
                                    appModule.controller(pc, aipController[pc]);
                                }
                            }
                            angular.bootstrap(bodyContent, ["BannerOnAngular"]);
                            element.append(bodyContent);
                        });
                }
                scope.$watch(function () {
                    return [attrs.aid, attrs.page];
                },  scope.getPagebuilderDetails, true);

            }
        }
    }
    angular.module('BannerOnAngular').directive('pagebuilderPage', [ '$compile','ItemListViewService',PageBuilderPage]);
}
