/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
// angular module init and configuration
"use strict";

var aipAppRoot = "/" + extensibilityInfo.application + "/plugins/" +
    window.aipApp.fileSystemName + "/aipApp/";
var aipAppAbsPath = window.location.protocol + "//" + window.location.host + Application.getApplicationPath() + "/";
var bcmRoot = window.location.protocol + Application.getApplicationPath();
sessionStorage.setItem('genAIPAppCallingPage', "");

// required global variables for PageBuilder render
var params = {};
var rootWebApp = aipAppAbsPath.replace("/ssb/", "/");
var resourceBase = rootWebApp + 'internalPb/';

var xhrHttpInterceptor = function () {
    return {
        response: function (res) {
            // if response is a redirection to a full html page then reload the rootWebapp
            // discards the response we received because there isn't a good way to process it
            if (typeof res.data === "string" && res.data.search(/<html/mi) !== -1) {
                window.location.assign(rootWebApp);
            }
            return res;
        }
    }
}

var bannerNonAdminAIPApp = angular.module("bannerNonAdminAIP", [
        "ngResource",
        "ngSanitize",
        "ui.router",
        "extensibility",
        "ui.bootstrap",
        "ngAria",
        "ngAnimate",
        "xe-ui-components",
        "bannerAIPUI",
        "bannerCommonAIP",
        "ngRoute",
        "SCEAIP",
        "ngCkeditor",
        "BannerOnAngular",
        "I18nAIP",
        "pbrun.directives",
        'dateParser',
        'cm.timepicker'


    ])

    //set application root url
    .constant('APP_ROOT', aipAppRoot)

    .constant('BCM_ROOT', bcmRoot)

    .constant('APP_PATH', Application.getApplicationPath())

    .constant("APP_ABS_PATH", aipAppAbsPath)

    //constants for page information
    .constant("PAGES", {

        "list": {
            url: "/list",
            templateUrl: "listItem/listItemPage.html",
            controller: "ListItemPageCtrl",
            breadcrumb: {
                label: "aip.user.actionItem.list",
                url: "/aip/list#/list"
            }
        },

        "informedList": {
            url: "/informedList",
            templateUrl: "listItem/listItemPage.html",
            controller: "ListItemPageCtrl",
            breadcrumb: {
                label: "aip.user.actionItem.list",
                url: "/aip/list#/list"
            },
            inform: true
        }

    }).factory('xhrHttpInterceptor', xhrHttpInterceptor)


    //provider-injector
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$windowProvider", "PAGES", "APP_ROOT", "APP_ABS_PATH",
        function ($stateProvider, $urlRouteProvider, $locationProvider, $httpProvider, $windowProvider,
                  PAGES, APP_ROOT, APP_ABS_PATH) {
// TODO: should this be HTML5 in HashBang mode with a base defined in the HTML?
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('');
            $urlRouteProvider.otherwise("/list");
            angular.forEach(PAGES, function (item, state) {
                $stateProvider.state(state, {
                    url: item.url,
                    templateUrl: APP_ROOT + item.templateUrl,
                    controller: item.controller,
                    params: item.params ? item.params : {
                        noti: undefined,
                        data: undefined,
                        inform: item.inform,
                        saved: undefined
                    },
                    onEnter: function ($stateParams, $filter) {
                        this.data.breadcrumbs.url = item.breadcrumb.url;
                        if ($stateParams.groupId || $stateParams.actionItemId) {
                            var params = item.url.split("/").filter(function (_item) {
                                return _item.startsWith(":");
                            });
                            var me = this;
                            angular.forEach(params, function (param) {
                                var key = param.replace(":", "");
                                if ($stateParams[key]) {
                                    me.data.breadcrumbs.url += "/" + $stateParams[key];
                                }
                            });
                        }
                        this.data.breadcrumbs.title = item.breadcrumb.label;
                    },
                    data: {
                        breadcrumbs: {}
                    }
                })
            });

            // Prevent using cache for GET method for IE cache issue
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Parama'] = 'no-cache';
            $httpProvider.interceptors.push('xhrHttpInterceptor');
        }
    ])

    //instance-injector
    .run(["$rootScope", "$window", "$location", "$state", "$stateParams", "$filter", "$sce", "$templateCache", "BreadcrumbService",
        function ($rootScope, $window, $location, $state, $stateParams, $filter, $sce, $templateCache, BreadcrumbService) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;


            //when state successfully changed, update breadcrumbs
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
                BreadcrumbService.updateBreadcrumb(toState.data.breadcrumbs);
            });

            //expose message.properties values for taglib
            //TODO:: find better way to handle this.
            //TODO:: use array and parse array in taglib
            // FIXME: refactor code to namespace to aip.*

            $.i18n.prop("actionItem.title.unique.error");

        }]
    );


bannerAIPUI
    .constant('APP_ROOT', aipAppRoot)//set application root url
    //supply directives' template url so that we don't have any hardcoded url in other code
    .config(['$provide', 'APP_ROOT', function ($provide, APP_ROOT) {
            //override angular-ui's default accordion-group directive template; h4 -> h2 for title
            $provide.decorator('uibAccordionGroupDirective', function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/list/template/listAccordionHeader.html";
                directive.replace = false;
                return $delegate;
            });
            $provide.decorator("aipListDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/list/template/list.html";
                return $delegate;
            });
            $provide.decorator("aipReadmoreDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/readmore/template/readmore.html";
                return $delegate;
            });
            $provide.decorator("aipItemDetailDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/item-detail/template/itemDetail.html";
                return $delegate;
            });
            $provide.decorator("aipAttachmentDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/aip-attachment/template/aipAttachment.html";
                return $delegate;
            });
        }]
    );


// Override common components
/*tab navigation*/
angular.module("templates/tabNav.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("templates/tabNav.html",
        "<div class=\"xe-tab-container\" role=\"presentation\"><ul class=\"xe-tab-nav\" role=\"tablist\"><li ng-repeat=\"tab in tabnav.tabs\" ng-click=\"tabnav.activate(tab)\" ng-class=\"{active: tab.active}\" ng-repeat-complete aria-controls=\"{{'xe-tab-panel'+ ($index+1)}}\" aria-selected=\"{{tab.active}}\" tabindex=\"-1\"><a ui-sref=\"{{ tab.state && tab.state || '#' }}\" href=\"#\" id=\"{{'xe-tab'+ ($index+1)}}\" title=\"{{tab.heading}}\" ng-if=\"tab.state\">{{tab.heading}} <span></span></a> <a href=\"javascript:void(0)\;\" role=\"tab\" id=\"{{'xe-tab'+ ($index+1)}}\" title=\"{{tab.heading}}\" ng-if=\"!tab.state\" aria-selected=\"{{tab.active}}\">{{tab.heading}} <span></span></a></li></ul><div class=\"xe-tab-content\" role=\"presentation\"><ng-transclude></ng-transclude></div></div>");
}]);

//TODO:: modifty droupdown template html to add grouping and filtering functionalities to xe-dropdown directive
angular.module("templates/dropdown.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("templates/dropdown.html",
        "<div class=\"btn-group\"><button type=\"button\" ng-disabled=\"{{disabled}}\" ng-class=\"{disabledDD:disabled}\" data-toggle=\"dropdown\" class=\"btn btn-default dropdown dropdown-toggle\" role=\"listbox\" aria-expanded=\"false\" aria-haspopup=\"true\"><span class=\"placeholder\" ng-show=\"!ngModel\">{{::xeLabel}}</span> <span class=\"placeholder\">{{ dropDownLabel }}</span> <span class=\"glyphicon glyphicon-chevron-down\"></span></button><ul class=\"dropdown-menu\" role=\"listbox\" aria-expanded=\"false\" role=\"listbox\"><li ng-hide=\"!ngModel\" ng-click=\"updateModel(xeLabel)\">{{::xeLabel}}</li><li ng-if=\"!isObject\" role=\"option\" ng-repeat=\"option in xeOptions track by $index\" ng-click=\"updateModel(option)\" ng-class=\"{'selected':option===ngModel}\">{{::option}}</li><li ng-if=\"isObject\" ng-repeat=\"option in xeOptions track by $index\" ng-click=\"updateModel(option)\">{{::option.label}}</li></ul></div>");
}]);


angular.module("BannerOnAngular")
    //set application root url
    .constant('APP_ROOT', aipAppRoot)
    .constant('BCM_ROOT', bcmRoot)
    .constant('APP_PATH', Application.getApplicationPath())
    .constant("APP_ABS_PATH", aipAppAbsPath)
    .constant("params", params)

    .config(['$provide', 'APP_ROOT', 'params', function ($provide, APP_ROOT, params) {
        $provide.decorator("pagebuilderPageDirective", function ($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/pagebuilder/template/aip-pagebuilder.html";
            return $delegate;
        });
        params.saved = false;
    }]);


