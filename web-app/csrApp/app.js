/**
 * Created by jshin on 12/8/15.
 */
// angular module init and configuration
"use strict";
var resourceUrl = window.csr.resourceUrl.split("/").splice(0,window.csr.resourceUrl.split("/").indexOf("csrApp")+1).join("/");
var scripts = document.getElementsByTagName("script")
var currentPath = scripts[scripts.length-1].src;
var currentRoot = "";
if(window.csr && window.csr.dev === "development") {
    currentRoot = currentPath.substring(0, currentPath.indexOf('app.js'));
} else {
    currentRoot = resourceUrl+"/";
}

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

//set application root url
    .constant('APP_ROOT', currentRoot)

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
