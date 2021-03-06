/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
var PB;
(function (PB) {
    var PageBuilderPage = /** @class */ (function () {
        function PageBuilderPage($compile, ItemListViewService) {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = false;
            this.scope = {
                content: "@",
                aid: "@",
                gid: "@",
                page: "@"
            };
            this.$compile = $compile;
            this.ItemListViewService = ItemListViewService;
        }
        PageBuilderPage.prototype.compile = function () {
        };
        PageBuilderPage.prototype.link = function (scope, element, attrs) {
            var self = this;
            scope.getPagebuilderDetails = function (tpl) {
                self.ItemListViewService.getPagebuilderPage(attrs.page, attrs.aid, attrs.gid)
                    .then(function (val) {
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
                        if (window[pbController]) {
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
            };
            scope.$watch(function () {
                return [attrs.aid, attrs.page];
            }, scope.getPagebuilderDetails, true);
        };
        PageBuilderPage.prototype.controller = function ($scope) {
        };
        PageBuilderPage.$inject = ["$compile", "ItemListViewService"];
        return PageBuilderPage;
    }());
    PB.PageBuilderPage = PageBuilderPage;
})(PB || (PB = {}));
register("BannerOnAngular").directive("pagebuilderPage", PB.PageBuilderPage);
