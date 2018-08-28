/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
// angular module init and configuration
"use strict";

var aipAppRoot = "/" + extensibilityInfo.application + "/plugins/" +
    window.aipApp.fileSystemName + "/aipApp/";
var aipAppAbsPath = window.location.protocol + "//" + window.location.host + Application.getApplicationPath() + "/";

sessionStorage.setItem('genAIPAppCallingPage', "");
// required global variables for PageBuilder render
var params = {};
var rootWebApp = aipAppAbsPath.replace("/ssb/", "/");
var resourceBase = rootWebApp + 'internalPb/';

var xhrHttpInterceptor= function (){
    return {
        response: function(res) {
            // if response is a redirection to a full html page then reload the rootWebapp
            // discards the response we received because there isn't a good way to process it
            if ( typeof res.data === "string" && res.data.search(/<html/mi )!== -1 )
            {
                 window.location.assign(rootWebApp);
            }
            return res;
        }
    }
}

var bannerAIPReviewApp = angular.module("bannerAIPReview", [
    "ngResource",
    "ngSanitize",
    "ui.router",
    "extensibility",
    "ui.bootstrap",
    "ngAria",
    "ngAnimate",
    "xe-ui-components",
    "bannerCommonAIP",
    "ngRoute",
    "SCEAIP",
    "I18nAIP",
    'dateParser',
    'cm.timepicker'
])

//set application root url
    .constant('APP_ROOT', aipAppRoot)

    .constant('APP_PATH', Application.getApplicationPath())

    .constant("APP_ABS_PATH", aipAppAbsPath)

    //constants for page information
    .constant("PAGES", {
        "monitor-action-item": {
            url: "/monitor",
            templateUrl: "review/monitorActionItem.html",
            controller: "monitorActionItemCtrl",
            breadcrumb: {
                label: "js.aip.review.monitor.action.item",
                url: "/aipReview"
            }
        }

    }).factory('xhrHttpInterceptor',xhrHttpInterceptor)
    //constant for endpoint
    .constant("ENDPOINT", {
        review: {

        }
    })
    .constant("PAGINATIONCONFIG",
        {
            pageLengths: [5, 10, 25, 50, 100],
            offset: 10,
            recordsFoundLabel: "Results found",
            pageTitle: "Go To Page (End)",
            pageLabel: "Page",
            pageAriaLabel: "Go To Page. Short cut is End",
            ofLabel: "of"
        })


    //provider-injector
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$windowProvider", "PAGES", "APP_ROOT", "APP_ABS_PATH",
        function ($stateProvider, $urlRouteProvider, $locationProvider, $httpProvider, $windowProvider,
                  PAGES, APP_ROOT, APP_ABS_PATH) {
// TODO: should this be HTML5 in HashBang mode with a base defined in the HTML?
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('');
            $urlRouteProvider.otherwise("/monitor");
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

            $rootScope.$on('$stateChangeStart', function (e, to) {
                if ($rootScope.DataChanged) {
                    e.preventDefault();
                }
            });


            //when state successfully changed, update breadcrumbs
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
                BreadcrumbService.updateBreadcrumb(toState.data.breadcrumbs);
            });

            //On everychange of location of Browser
            $rootScope.$on('$locationChangeStart', function (event, next, current, state) {
                if ($rootScope.DataChanged) {
                    $rootScope.$broadcast('DetectChanges', {state: next});
                    event.preventDefault();

                }
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

