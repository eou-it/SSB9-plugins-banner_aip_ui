/**
 * Created by jshin on 12/8/15.
 */
// angular module init and configuration
"use strict";

var bannerCSRUi = angular.module("bannercsrui", []);

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

//constants for page information
    .constant("PAGES", {
        "admin-landing": {
            url: "/admin/landing",
            templateUrl: "../plugins/banner-csr-ui-1.0/csrApp/admin/adminLandingPage.html",
            controller: "AdminLandingPageCtrl",
            breadcrumb: {
                label: "Confirmation Management",
                url: "/admin/landing"
            }
        },
        "admin-list": {
            url: "/admin/list",
            templateUrl: "../plugins/banner-csr-ui-1.0/csrApp/admin/listActionItem/adminListItemPage.html",
            controller: "AdminListItemPageCtrl",
            breadcrumb: {
                label: "Confirmation Maintenance",
                url: "/admin/list"
            }
        },
        "list": {
            url: "/list",
            templateUrl: "../plugins/banner-csr-ui-1.0/csrApp/listItem/listItemPage.html",
            controller: "ListItemPageCtrl",
            breadcrumb: {
                label: "Confirmation List",
                url: "/list"
            }
        },
        "listConfirm": {
            url: "/list/confirm/:itemId",
            templateUrl: "../plugins/banner-csr-ui-1.0/csrApp/listItem/itemConfirm/itemConfirmPage.html",
            controller: "ItemConfirmCtrl",
            breadcrumb: {
                label: "Confirmation",
                url: "/list/confirm"
            }
        }
    })


//set application root url
//    .constant('CONTEXT_ROOT', {url: "/" + document.location.pathname.slice(Application.getApplicationPath().length+1) + "#"})

//provider-injector
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "PAGES",
        function($stateProvider, $urlRouteProvider, $locationProvider, PAGES) {
            $urlRouteProvider.otherwise("/list");

            angular.forEach(PAGES, function(item, state) {
                $stateProvider.state(state, {
                    url: item.url,
                    templateUrl: item.templateUrl,
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
