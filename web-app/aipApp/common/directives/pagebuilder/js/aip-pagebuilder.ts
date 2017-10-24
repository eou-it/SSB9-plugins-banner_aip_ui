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
            this.replace=true;
            this.scope = {
                content:"@",
                aid: "@",
                gid: "@"
            }
            this.$compile = $compile;
            this.ItemListViewService = ItemListViewService;
        }
        compile() {

        }
        link(scope, element, attrs) {
            var self = this;

            attrs.$observe('aid', (tpl)  => {
                var me = self;
                console.log(window);
                self.ItemListViewService.getPagebuilderPage('aip.MasterTemplateSystemRequired', attrs.aid, attrs.gid)
                    .then((val) => {
                        element.children().empty();
                        var tempElement = angular.element(val.html);

                        var bodyContent = tempElement.filter("div.customPage").attr("id", "PBContent");

                        var aipController = {};
                        var pbController = window.controllerId;
                        var appModule = appModule||angular.module('BannerOnAngular');

                        appModule.requires.push('ngResource','ngGrid','ui', 'pbrun.directives', 'ngSanitize', 'xe-ui-components');

                        if (window[pbController]) { // backwards compatible with alpha release
                            aipController[pbController] = window[pbController];
                        }
                        for (var pc in aipController) {
                            if (aipController.hasOwnProperty(pc)) {
                                appModule.controller(pc, aipController[pc]);
                            }
                        }

                        angular.bootstrap(bodyContent, ["BannerOnAngular"]);
                       // element.empty();
                        element.append(bodyContent);
                        me.$compile(element)(scope);
                    });
            })

        }
        controller($scope) {

        }
    }
}

register("BannerOnAngular").directive("pagebuilderPage", PB.PageBuilderPage);