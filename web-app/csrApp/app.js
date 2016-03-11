/**
 * Created by jshin on 12/8/15.
 */
// angular module init and configuration
"use strict";
//var appHostUrl = window.location.host +
//    window.location.pathname.split("/")
//        .splice(0, window.location.pathname
//            .split("/").indexOf("csr"))
//        .join("/") + "/";
var csrAppRoot = "/" + extensibilityInfo.application + "/plugins/" +
    window.csrApp.name.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase() + "-" +
    window.csrApp.version + "/csrApp/";

var bannerCSRApp = angular.module("bannercsr", [
    "ngResource",
    "ngSanitize",
    "ui.router",
    "ui.bootstrap",
    "ngAria",
    "I18n",
    "ngAnimate",
    "xe-ui-components",
    "bannercsrui"
    ])

//set application root url
    .constant('APP_ROOT', csrAppRoot)

//constants for page information
    .constant("PAGES", {
        "admin-landing": {
            url: "/admin/landing",
            templateUrl:"admin/adminLandingPage.html",
            controller: "AdminLandingPageCtrl",
            breadcrumb: {
                label: "Confirmation Management",
                url: "/admin/landing"
            }
        },
        "admin-list": {
            url: "/admin/list",
            templateUrl:"admin/listActionItem/adminListItemPage.html",
            controller: "AdminListItemPageCtrl",
            breadcrumb: {
                label: "Confirmation Maintenance",
                url: "/admin/list"
            }
        },
        "list": {
            url: "/list",
            templateUrl:"listItem/listItemPage.html",
            controller: "ListItemPageCtrl",
            breadcrumb: {
                label: "Confirmation List",
                url: "/list"
            }
        },
        "listConfirm": {
            url: "/list/confirm/:itemId",
            templateUrl:"listItem/itemConfirm/itemConfirmPage.html",
            controller: "ItemConfirmCtrl",
            breadcrumb: {
                label: "Confirmation",
                url: "/list/confirm"
            }
        }
    })

//provider-injector
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "PAGES", "APP_ROOT",
        function($stateProvider, $urlRouteProvider, $locationProvider, PAGES, APP_ROOT, $state) {
            $urlRouteProvider.otherwise("/list");

            angular.forEach(PAGES, function(item, state) {
                $stateProvider.state(state, {
                    url: item.url,
                    templateUrl: APP_ROOT + item.templateUrl,
                    controller: item.controller,
                    onEnter: function($stateParams, $filter) {
                        this.data.breadcrumbs.url = item.breadcrumb.url;
                        this.data.breadcrumbs.title = item.breadcrumb.label;
                    },
                    data: {
                        breadcrumbs: {}
                    }
                })
            });
        }
    ])

//instance-injector
    .run(["$rootScope", "$state", "$stateParams", "$filter", "CsrBreadcrumbService",
        function($rootScope, $state, $stateParams, $filter, CsrBreadcrumService) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            //when state successfully changed, update breadcrumbs
            $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
                CsrBreadcrumService.updateBreadcrumb(toState.data.breadcrumbs);
            })

    }]
);

var bannerCSRUi = angular.module("bannercsrui", [])
    //supply directives' template url so that we don't have any hardcoded url in other code
    .config(['$provide', function($provide) {
        //override angular-ui's default accordion-group directive template; h4 -> h2 for title
        $provide.decorator('uibAccordionGroupDirective', function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = csrAppRoot + "common/directives/csr-list/template/csrListAccordionHeader.html";
            return $delegate;
        });
        $provide.decorator("csrListDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = csrAppRoot + "common/directives/csr-list/template/csrList.html";
            return $delegate;
        });
        $provide.decorator("csrReadmoreDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = csrAppRoot + "common/directives/csr-readmore/template/csrReadmore.html";
            return $delegate;
        })
        $provide.decorator("csrLandingItemDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = csrAppRoot + "common/directives/csr-landing-item/template/csrLandingItem.html";
            return $delegate;
        })
    }]
);