/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;
//var CustomPageController;
declare var CustomPageController;

declare var params;

module PB {
    export class PageBuilderPage {
        static $inject = ["$compile", "ItemListViewService"]
        templateUrl: string;
        template;
        restrict: string;
        scope:any;
        APP_PATH;
        transclude: boolean;
        replace: boolean;
        $compile;
        ItemListViewService;

        pbDataSet;
        pbResource;
        pbAddCommon;
        $locale;
        $templateCache;

        constructor($compile, ItemListViewService) {
            this.restrict = "AE";
            this.transclude = true;
            this.replace=false;
            this.scope = {
                content:"@",
                aid: "@",
                gid: "@",
                page: "@"
            };
            this.$compile = $compile;
            this.ItemListViewService = ItemListViewService;
        }
        compile() {

        }
        link(scope, element, attrs) {
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
        controller($scope) {

        }
    }
}

register("BannerOnAngular").directive("pagebuilderPage", PB.PageBuilderPage);
