///<reference path="../../../../../typings/tsd.d.ts"/>
var PB;
(function (PB) {
    var PageBuilderPage = (function () {
        function PageBuilderPage($compile, ItemListViewService) {
            this.restrict = "AE";
            this.transclude = true;
            this.replace = true;
            this.scope = {
                content: "@",
                aid: "@",
                gid: "@"
            };
            this.$compile = $compile;
            this.ItemListViewService = ItemListViewService;
        }
        PageBuilderPage.prototype.compile = function () {
        };
        PageBuilderPage.prototype.link = function (scope, element, attrs) {
            var self = this;
            attrs.$observe('aid', function (tpl) {
                var me = self;
                self.ItemListViewService.getPagebuilderPage("ActionItemPolicy", attrs.aid, attrs.gid)
                    .then(function (val) {
                    element.children().empty();
                    var tempElement = angular.element(val.html);
                    var bodyContent = tempElement.filter("div");
                    //var bodyContent = tempElement.filter(function(index) {
                    //   return this.tagName==="SCRIPT" || this.tagName==="DIV"
                    //});
                    //eval(val.control);
                    // var validateResult = val.validateResult;
                    // var appElement = document.querySelector('[ng-app="BannerOnAngular"]');
                    // var appScope = angular.element(appElement).scope();
                    // me.$compile(bodyContent)(appScope);
                    bodyContent.filter("div").attr("id", "PBContent");
                    //var bodyContent2 = me.$compile(bodyContent)(scope);
                    // eval("var "+"CustomPageController_"+val.pageName+"="+val.script);
                    angular.module("BannerOnAngular").controller("CustomPageController_" + val.pageName, eval("CustomPageController_" + val.pageName));
                    angular.module("BannerOnAngular").requires.push('ngResource', 'ngGrid', 'ui', 'pbrun.directives', 'ngSanitize', 'xe-ui-components');
                    angular.bootstrap(bodyContent, ["BannerOnAngular"]);
                    element.empty();
                    element.append(bodyContent);
                    me.$compile(element)(scope);
                });
            });
        };
        PageBuilderPage.prototype.controller = function ($scope) {
        };
        PageBuilderPage.$inject = ["$compile", "ItemListViewService"];
        return PageBuilderPage;
    }());
    PB.PageBuilderPage = PageBuilderPage;
})(PB || (PB = {}));
register("BannerOnAngular").directive("pagebuilderPage", PB.PageBuilderPage);
