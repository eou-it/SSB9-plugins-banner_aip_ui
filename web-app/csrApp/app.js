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
    "I18nCSR",
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
                label: "csr.admin.landing",
                url: "/admin/landing"
            }
        },
        "admin-list": {
            url: "/admin/list",
            templateUrl:"admin/listActionItem/adminListItemPage.html",
            controller: "AdminListItemPageCtrl",
            breadcrumb: {
                label: "csr.admin.group",
                url: "/admin/list"
            }
        },
        "admin-group-add": {
            url: "/admin/group/add",
            templateUrl:"admin/group/add/adminGroupAddPage.html",
            controller:"AdminGroupAddPageCtrl",
            breadcrumb: {
                label: "csr.admin.group.add",
                url: "/admin/group/add"
            }
        },
        "list": {
            url: "/list",
            templateUrl:"listItem/listItemPage.html",
            controller: "ListItemPageCtrl",
            breadcrumb: {
                label: "csr.user.actionItem.list",
                url: "/list"
            }
        }//,
        //"listConfirm": {
        //    url: "/list/confirm/:itemId",
        //    templateUrl:"listItem/itemConfirm/itemConfirmPage.html",
        //    controller: "ItemConfirmCtrl",
        //    breadcrumb: {
        //        label: "Confirmation",
        //        url: "/list/confirm"
        //    }
        //}
    })
//constant for endpoint
    .constant("ENDPOINT", {
        admin: {
            actionItem: "csr/adminActionItems",
            groupList: "csr/adminActionItems"
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

            //expose message.properties values for taglib
            //TODO:: find better way to handle this.
            //TODO:: use array and parse array in taglib
            $.i18n.prop("csr.welcome");
            $.i18n.prop("csr.welcome.text");
            $.i18n.prop("csr.common.title");
            $.i18n.prop("csr.common.status");
            $.i18n.prop("csr.common.folder");
            $.i18n.prop("csr.common.save");
            $.i18n.prop("csr.common.cancel");
            $.i18n.prop("csr.common.next");

            $.i18n.prop("csr.placeholder.noitems");

            $.i18n.prop("csr.admin.landing");

            $.i18n.prop("csr.admin.group");
            $.i18n.prop("csr.admin.group.description");
            $.i18n.prop("csr.admin.group.add");
            $.i18n.prop("csr.status.active");
            $.i18n.prop("csr.status.inactive");
            $.i18n.prop("csr.status.pending");
            $.i18n.prop("csr.status.complete");

            $.i18n.prop("csr.user.actionItem.list");
            $.i18n.prop("csr.user.list.header.title.registration");
            $.i18n.prop("csr.user.list.header.description.registration");
            $.i18n.prop("csr.user.list.header.title.graduation");
            $.i18n.prop("csr.user.list.header.description.graduation");

            $.i18n.prop("csr.user.detail.button.proceed");
            $.i18n.prop("csr.user.detail.button.confirm");
            $.i18n.prop("csr.user.detail.button.deny");
            $.i18n.prop("csr.user.detail.button.return");
    }]
);

var bannerCSRUi = angular.module("bannercsrui", [])
    //set application root url
    .constant('APP_ROOT', csrAppRoot)

    //supply directives' template url so that we don't have any hardcoded url in other code
    .config(['$provide', 'APP_ROOT', function($provide, APP_ROOT) {
        //override angular-ui's default accordion-group directive template; h4 -> h2 for title
        $provide.decorator('uibAccordionGroupDirective', function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/csr-list/template/csrListAccordionHeader.html";
            return $delegate;
        });
        $provide.decorator("csrListDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/csr-list/template/csrList.html";
            return $delegate;
        });
        $provide.decorator("csrReadmoreDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/csr-readmore/template/csrReadmore.html";
            return $delegate;
        });
        $provide.decorator("csrLandingItemDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/admin/csr-landing-item/template/csrLandingItem.html";
            return $delegate;
        });
        $provide.decorator("csrItemDetailDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/csr-item-detail/template/csrItemDetail.html";
            return $delegate;
        });
    }]
);