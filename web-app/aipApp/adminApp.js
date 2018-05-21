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




var bannerAIPApp = angular.module("bannerAIP", [
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
        "admin-landing": {
            url: "/landing",
            templateUrl: "admin/adminLandingPage.html",
            controller: "AdminLandingPageCtrl",
            breadcrumb: {
                label: "aip.admin.landing",
                url: "/aip/#/landing"
            }
        },
        "admin-action-list": {
            url: "/action",
            templateUrl: "admin/action/list/adminActionListPage.html",
            breadcrumb: {
                label: "aip.admin.action",
                url: "/aip/#/action"
            }
        },
        "admin-post-list": {
            url: "/post",
            templateUrl: "admin/action/post/postActionListPage.html",
            breadcrumb: {
                label: "aip.admin.action.item.post.item",
                url: "/aip/#/post"

            }
        },
        "admin-post-add": {
            url: "/action/addjob",
            templateUrl: "admin/action/post/adminPostItemAddPage.html",
            controller: "AdminPostItemAddPageCtrl",
            breadcrumb: {
                label: "aip.admin.action.actionItem.Addjob",
                url: "/aip/#/action/add"
            }
        },
        "admin-post-edit": {
            url: "/action/editjob/:postIdval/:isEdit",
            templateUrl: "admin/action/post/adminPostItemAddPage.html",
            controller: "AdminPostItemAddPageCtrl",
            params: {
                postIdval: null,
                isEdit: null
            },
            breadcrumb: {
                label: "aip.admin.action.actionItem.Editjob",
                url: "/aip/#/action/editjob"
            }
        },
        "admin-action-add": {
            url: "/action/add",
            templateUrl: "admin/action/add/adminActionItemAddPage.html",
            controller: "AdminActionItemAddPageCtrl",
            breadcrumb: {
                label: "aip.admin.action.add.actionItem",
                url: "/aip/#/action/add"
            }
        },
        "admin-action-open": {
            url: "/action/open/:actionItemId",
            templateUrl: "admin/action/open/adminActionItemOpenPage.html",
            controller: "AdminActionItemOpenPageCtrl",
            params: {
                actionItemId: null,
                noti: null
            },
            breadcrumb: {
                label: "aip.admin.action.open",
                url: "/aip/#/action/open"
            }
        },
        "admin-action-edit": {
            url: "/action/edit/:actionItemId/:isEdit",
            templateUrl: "admin/action/add/adminActionItemAddPage.html",
            controller: "AdminActionItemAddPageCtrl",
            params: {
                actionItemId: null,
                isEdit: null
            },
            breadcrumb: {
                label: "aip.admin.action.edit.actionItem",
                url: "/aip/#/action/edit"
            }
        },
        "admin-group-list": {
            url: "/group",
            templateUrl: "admin/group/list/adminGroupListPage.html",
            //controller: "AdminGroupListPageCtrl",
            breadcrumb: {
                label: "aip.admin.groups",
                url: "/aip/#/group"
            }
        },
        "admin-group-add": {
            url: "/group/add",
            templateUrl: "admin/group/add/adminGroupAddPage.html",
            controller: "AdminGroupAddPageCtrl",
            params: {
                groupId: null
            },
            breadcrumb: {
                label: "aip.admin.group.add",
                url: "/aip/#/group/add"
            }
        },
        "admin-group-edit": {
            url: "/group/edit/:groupId/:isEdit",
            templateUrl: "admin/group/add/adminGroupAddPage.html",
            controller: "AdminGroupAddPageCtrl",
            params: {
                groupId: null,
                isEdit: null
            },
            breadcrumb: {
                label: "aip.admin.group.edit",
                url: "/aip/#/group/edit"
            }
        },
        "admin-group-open": {
            url: "/group/open/:groupId",
            templateUrl: "admin/group/open/adminGroupOpenPage.html",
            controller: "AdminGroupOpenPageCtrl",
            params: {
                groupId: null,
                noti: null
            },
            breadcrumb: {
                label: "aip.admin.group.open",
                url: "/aip/#/group/open"

            }
        },
        "admin-status-list": {
            url: "/status",
            templateUrl: "admin/status/list/adminStatusListPage.html",
            //controller: "AdminGroupListPageCtrl",
            breadcrumb: {
                label: "aip.admin.status",
                url: "/aip/admin#/status"
            }
        },
        "admin-manage-list": {
            //url: "/status",
            //templateUrl: "admin/status/list/adminStatusListPage.html",
            //controller: "AdminGroupListPageCtrl",
            breadcrumb: {
                label: "aip.admin.status",
                url: "/aip/#/status"
            }
        }

    }).factory('xhrHttpInterceptor',xhrHttpInterceptor)
    //constant for endpoint
    .constant("ENDPOINT", {
        admin: {
            folders: aipAppAbsPath + "aipAdmin/folders",
            groupList: aipAppAbsPath + "aipAdmin/groupList",
            groupStatus: aipAppAbsPath + "aipAdmin/adminGroupStatus",
            createOrUpdateGroup: aipAppAbsPath + "aipAdmin/createOrUpdateGroup",
            openGroup: aipAppAbsPath + "aipAdmin/openGroup",
            // actionList: aipAppAbsPath + "aip/adminActionLists",
            actionItemList: aipAppAbsPath + "aipAdmin/actionItemList",
            adminActionItemStatus: aipAppAbsPath + "aipAdmin/adminGroupStatus", //todo: replace with future lookup table and rename
            actionItemStatusList: aipAppAbsPath + "aipAdmin/actionItemStatusList", //simple list of statuses
            actionItemStatusGrid: aipAppAbsPath + "aipAdmin/actionItemStatusGridList", //filterable list for grid functionality
            createActionItem: aipAppAbsPath + "aipAdmin/addActionItem",
            openActionItem: aipAppAbsPath + "aipAdmin/openActionItem",
            getGroupLov: aipAppAbsPath + "aipActionItemPosting/getGroupLov",
            populationListForSendLov: aipAppAbsPath + "aipActionItemPosting/populationListForSendLov",
            createPostActionItem: aipAppAbsPath + "aipActionItemPosting/addActionItemPosting ",
            getActionGroupActionItemLov: aipAppAbsPath + "aipActionItemPosting/getActionGroupActionItemLov",
            actionItemPostJobList: aipAppAbsPath + "aipActionItemPosting/actionItemPostJobList",
            actionItemTemplateList: aipAppAbsPath + "aipAdmin/actionItemTemplateList",
            saveActionItemTemplate: aipAppAbsPath + "aipAdmin/updateActionItemDetailWithTemplate",
            statusSave: aipAppAbsPath + "aipAdmin/statusSave",
            removeStatus: aipAppAbsPath + "aipAdmin/removeStatus",
            deleteActionItem: aipAppAbsPath + "aipAdmin/deleteActionItem",
            editActionItem: aipAppAbsPath + "aipAdmin/editActionItem",
            deleteGroup: aipAppAbsPath + "aipAdmin/deleteGroup",
            rulesByActionItem: aipAppAbsPath + "aipAdmin/actionItemStatusRulesByActionItemId",
            updateActionItemStatusRule: aipAppAbsPath + "aipAdmin/updateActionItemStatusRule",
            blockedProcessList: aipAppAbsPath + "aipAdmin/blockedProcessList",
            updateBlockedProcessItems: aipAppAbsPath + "aipAdmin/updateBlockedProcessItems",
            getAssignedActionItemInGroup: aipAppAbsPath + "aipAdmin/getAssignedActionItemInGroup",
            listActionItemForSelect: aipAppAbsPath + "aipAdmin/getActionItemsListForSelect",
            updateActionItemGroupAssignment: aipAppAbsPath + "aipAdmin/updateActionItemGroupAssignment",
            groupPosted: aipAppAbsPath + "aipAdmin/groupPosted",
            fetchCurrentDateInLocaleFormat: aipAppAbsPath + "aipAdmin/fetchCurrentDateInLocaleFormat",
            is12HourClock: aipAppAbsPath + "aipAdmin/is12HourClock",
            listAvailableTimezones: aipAppAbsPath + "aipAdmin/listAvailableTimezones",
            checkActionItemPosted: aipAppAbsPath + "aipAdmin/checkActionItemPosted",
            loadBlockingProcessLov: aipAppAbsPath + "aipAdmin/loadBlockingProcessLov",
            statusPosted: aipAppAbsPath + "aipActionItemPosting/getStatusValue",
            jobDetailsById: aipAppAbsPath + "aipActionItemPosting/getJobDetailsByPostId",
            actionItemById: aipAppAbsPath + "aipActionItemPosting/getActionItemByPostId",
            updateActionItemPosting: aipAppAbsPath + "aipActionItemPosting/updateActionItemPosting"


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


    .constant("CKEDITORCONFIG",
        {
            disableNativeSpellChecker: false,
            height: '400px',
            width: '100%',
            pasteFromWordRemoveFontStyles: true,
            pasteFromWordRemoveStyles: true,
            allowedContent: true,
            fullPage: true,
            toolbarCanCollapse: true,
            toolbarStartupExpanded: true
        })


    //provider-injector
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$windowProvider", "PAGES", "APP_ROOT", "APP_ABS_PATH",
        function ($stateProvider, $urlRouteProvider, $locationProvider, $httpProvider, $windowProvider,
                  PAGES, APP_ROOT, APP_ABS_PATH) {
// TODO: should this be HTML5 in HashBang mode with a base defined in the HTML?
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('');
            $urlRouteProvider.otherwise("/landing");
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

            CKEDITOR.on('instanceCreated', function (event) {
                var editor = event.editor,
                    element = editor.element;
                // Customize the editor configurations on "configLoaded" event,
                // which is fired after the configuration file loading and
                // execution. This makes it possible to change the
                // configurations before the editor initialization takes place.
                editor.on('configLoaded', function () {
                    // Remove unnecessary plugins to make the editor simpler.
                    editor.config.removePlugins = 'flash,forms,iframe,newpage,smiley';
                    var helpLabel = $.i18n.prop("aip.ckeditor.keyhelp");

                    editor.ui.addButton('A11YBtn', {
                        label: helpLabel,
                        command: 'a11yHelp',
                        toolbar: 'about'
                    });

                    editor.config.height = '30em',
                        editor.config.width = '100%',

                        // Rearrange the layout of the toolbar.
                        editor.config.toolbar = [
                            {name: 'document', items: ['Source']},
                            {
                                name: 'clipboard',
                                items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
                            },
                            //{ name: 'editing', items: [ 'Scayt' ] },
                            {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
                            {name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']},
                            {name: 'tools', items: ['Maximize']},
                            '/',
                            {name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']},
                            {name: 'colors', items: ['TextColor', 'BGColor']},
                            {
                                name: 'paragraph',
                                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
                            },
                            {name: 'styles', items: ['Format', 'Font', 'FontSize']},
                            {name: 'about', items: ['About', 'A11YBtn']}
                        ];

                    editor.config.format_tags = 'p;h1;h2;h3;h5;h6;pre;address;div';
                });
            });
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
            $provide.decorator("aipLandingItemDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/admin/landing-item/template/landingItem.html";
                return $delegate;
            });
            $provide.decorator("aipItemDetailDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/item-detail/template/itemDetail.html";
                return $delegate;
            });

            $provide.decorator("aipGroupDetailDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/admin/group-detail/template/groupDetail.html";
                return $delegate;
            });
            $provide.decorator("aipStatusRuleDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/admin/status-rule/template/statusRule.html";
                return $delegate;
            });
            $provide.decorator("aipBlockedProcessDirective", function ($delegate) {
                var directive = $delegate[0];
                directive.templateUrl = APP_ROOT + "common/directives/admin/blockedProcess/template/blockedProcess.html";
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


