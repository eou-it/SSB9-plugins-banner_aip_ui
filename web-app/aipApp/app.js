// angular module init and configuration
"use strict";

var aipAppRoot = "/" + extensibilityInfo.application + "/plugins/" +
    window.aipApp.fileSystemName + "/aipApp/";
var aipAppAbsPath = window.location.protocol + "//" + window.location.host + Application.getApplicationPath() + "/";

var bannerAIPApp = angular.module("bannerAIP", [
    "ngResource",
    "ngSanitize",
    "ui.router",
    "extensibility",
    "ui.bootstrap",
    "ngAria",
    "I18nAIP",
    "ngAnimate",
    "xe-ui-components",
    "bannerAIPUI",
    "ngRoute",
    "SCEAIP",
    "ngCkeditor"
    //"xe-ui-components"
    ])

//set application root url
    .constant('APP_ROOT', aipAppRoot)

    .constant('APP_PATH', Application.getApplicationPath())

    .constant("APP_ABS_PATH", aipAppAbsPath)

//constants for page information
    .constant("PAGES", {
        "admin-landing": {
            url: "/landing",
            templateUrl:"admin/adminLandingPage.html",
            controller: "AdminLandingPageCtrl",
            breadcrumb: {
                label: "aip.admin.landing",
                url: "/aip/admin#/landing"
            }
        },
        "admin-action-list": {
            url: "/action",
            templateUrl: "admin/action/list/adminActionListPage.html",
            breadcrumb: {
                label: "aip.admin.action",
                url: "/aip/admin#/action"
            }
        },
        "admin-action-add": {
            url: "/action/add",
            templateUrl:"admin/action/add/adminActionItemAddPage.html",
            controller:"AdminActionItemAddPageCtrl",
            breadcrumb: {
                label: "aip.admin.action.add.actionItem",
                url: "/aip/admin#/action/add"}
        },
        "admin-action-open": {
            url: "/action/open",
            templateUrl:"admin/action/open/adminActionItemOpenPage.html",
            controller:"AdminActionItemOpenPageCtrl",
            breadcrumb: {
                label: "aip.admin.action.open",
                url: "/aip/admin#/action/open",
            }
        },
        "admin-group-list": {
            url: "/group",
            templateUrl: "admin/group/list/adminGroupListPage.html",
            //controller: "AdminGroupListPageCtrl",
            breadcrumb: {
                label: "aip.admin.group",
                url: "/aip/admin#/group"
            }
        },
        "admin-group-add": {
            url: "/group/add",
            templateUrl:"admin/group/add/adminGroupAddPage.html",
            controller:"AdminGroupAddPageCtrl",
            breadcrumb: {
                label: "aip.admin.group.add",
                url: "/aip/admin#/group/add"}
        },
        "admin-group-open": {
            url: "/group/open",
            templateUrl:"admin/group/open/adminGroupOpenPage.html",
            //controller:"AdminGroupOpenPageCtrl",
            breadcrumb: {
                label: "aip.admin.group.open",
                url: "/aip/admin#/group/open",

            }
        },

        "list": {
            url: "/list",
            templateUrl:"listItem/listItemPage.html",
            controller: "ListItemPageCtrl",
            breadcrumb: {
                label: "aip.user.actionItem.list",
                url: "/aip/list#/list"
            }
        }
    })
//constant for endpoint
    .constant("ENDPOINT", {
        admin: {
            folders: aipAppAbsPath + "aipAdmin/folders",
            addFolder: aipAppAbsPath + "aipAdmin/addFolder",

            groupList: aipAppAbsPath + "aipAdmin/groupList",
            groupStatus: aipAppAbsPath + "aip/adminGroupStatus",
            createGroup: aipAppAbsPath + "aipAdmin/createGroup",
            openGroup: aipAppAbsPath + "aipAdmin/openGroup",
            // actionList: aipAppAbsPath + "aip/adminActionLists",

            actionItemList: aipAppAbsPath + "aipAdmin/actionItemList",
            actionItemStatus: aipAppAbsPath + "aipAdmin/adminActionItemStatus",
            createActionItem: aipAppAbsPath + "aipAdmin/addActionItem",
            editActionItemContent: aipAppAbsPath + "aipAdmin/editActionItemContent",
            openActionItem: aipAppAbsPath + "aipAdmin/openActionItem",
            actionItemTemplateList: aipAppAbsPath + "aipAdmin/actionItemTemplateList",
            saveActionItemTemplate: aipAppAbsPath + "aipAdmin/updateActionItemDetailWithTemplate"
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
                    toolbar: 'full',
                    toolbar_full: [
                        { name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] },
                        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                        { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                        { name: 'basicstyles',
                            items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
                        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
                        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                        { name: 'tools', items: [ 'Maximize', 'ShowBlocks', '-', 'About' ] },
                        '/',
                        { name: 'styles', items: [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
                        { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak' ] },

                    ],
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
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider",  "$httpProvider",
        "PAGES", "APP_ROOT", "APP_ABS_PATH",
        function($stateProvider, $urlRouteProvider, $locationProvider, $httpProvider,
                 PAGES, APP_ROOT, APP_ABS_PATH) {
            $urlRouteProvider.otherwise("/list");
            angular.forEach(PAGES, function(item, state) {
                $stateProvider.state(state, {
                    url: item.url,
                    templateUrl: APP_ROOT + item.templateUrl,
                    controller: item.controller,
                    params: {noti:undefined, data:undefined},
                    onEnter: function($stateParams, $filter) {
                        this.data.breadcrumbs.url = item.breadcrumb.url;
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
        }
    ])

//instance-injector
    .run(["$rootScope", "$state", "$stateParams", "$filter","$sce", "$templateCache","BreadcrumbService",
        function($rootScope, $state, $stateParams, $filter, $sce, $templateCache, BreadcrumService) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //when state successfully changed, update breadcrumbs
            $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
                BreadcrumService.updateBreadcrumb(toState.data.breadcrumbs);
            });
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

            });
            $rootScope.$on("$stateNotFound", function(err) {

            });
            // $templateCache.put('adminActionItemOpenOverview.html', '<div class="actionItemElement actionItemDetail col-xs-12 col-sm-8"><h3>{{"aip.list.grid.itemTitle"|i18n_aip}}</h3><p class="openActionItemTitle">{{vm.actionItem.title}}</p><h3>{{"aip.common.folder"|i18n_aip}}</h3></div><div class="hidden-xs col-sm-1 dividerContainer" ng-style="vm.getSaparatorHeight()"><div class="divider"></div></div><div class="actionItemElement col-xs-12 col-sm-3"><h3>{{"aip.common.activity"|i18n_aip}}</h3><hr /><div class="actionItemElement"><h4>{{"aip.common.last.updated.by"|i18n_aip}}</h4><p class="openActionItemLastUpdatedBy">{{vm.actionItem.creatorId}}</p></div><hr /><div class="actionItemElement"> <h4>{{"aip.common.activity.date"|i18n_aip}}</h4><p class="openActionItemActivityDate">{{vm.actionItem.activityDate}}</p></div></div>');


            //expose message.properties values for taglib
            //TODO:: find better way to handle this.
            //TODO:: use array and parse array in taglib
            $.i18n.prop("aip.welcome");
            $.i18n.prop("aip.welcome.text");
            $.i18n.prop("aip.common.baseline");
            $.i18n.prop("aip.common.local");
            $.i18n.prop("aip.common.title");
            $.i18n.prop("aip.common.status");
            $.i18n.prop("aip.common.folder");
            $.i18n.prop("aip.common.group.description");
            $.i18n.prop("aip.common.description");
            $.i18n.prop("aip.common.activity");
            $.i18n.prop("aip.common.activity.date");
            $.i18n.prop("aip.common.last.updated.by");
            $.i18n.prop("aip.common.save");
            $.i18n.prop("aip.common.cancel");
            $.i18n.prop("aip.common.next");
            $.i18n.prop("aip.common.add");
            $.i18n.prop("aip.common.add.new");
            $.i18n.prop("aip.common.open");
            $.i18n.prop("aip.common.overview");
            $.i18n.prop("aip.common.table.action.items");
            $.i18n.prop("aip.common.order.action.items");
            $.i18n.prop("aip.common.block.processes");
            $.i18n.prop("aip.common.saveandreturn");
            $.i18n.prop("aip.common.add.group.jaws");
            $.i18n.prop("aip.common.open.group.jaws");
            $.i18n.prop("aip.common.no.results.found");
            $.i18n.prop("aip.common.results.found");
            $.i18n.prop("aip.common.select.folder.default");
            $.i18n.prop("aip.common.plainText");
            $.i18n.prop("aip.placeholder.nogroups");
            $.i18n.prop("aip.placeholder.noitems");
            $.i18n.prop("aip.common.text.template");
            $.i18n.prop("aip.common.text.content");

            $.i18n.prop("aip.admin.landing");

            $.i18n.prop("aip.admin.maxLength");
            $.i18n.prop("aip.admin.error.exceedMax");

            $.i18n.prop("aip.admin.group");
            $.i18n.prop("aip.admin.group.description");
            $.i18n.prop("aip.admin.group.add");
            $.i18n.prop("aip.admin.group.open");
            $.i18n.prop("aip.admin.group.add.maxLength");
            $.i18n.prop("aip.admin.group.error.exceedMax");

            $.i18n.prop("aip.admin.group.add.status.default");
            $.i18n.prop("aip.admin.group.add.folder.default");
            $.i18n.prop("aip.admin.group.add.defaultFolder");
            $.i18n.prop("aip.admin.group.add.success");
            $.i18n.prop("aip.admin.group.add.error.blank");
            $.i18n.prop("aip.admin.group.add.error.noStatus");
            $.i18n.prop("aip.admin.group.add.error.noFolder");
            $.i18n.prop("aip.admin.group.add.error.noTitle");
            $.i18n.prop("aip.admin.group.add.error.noDesc");
            $.i18n.prop("aip.admin.group.add.maxLength");
            $.i18n.prop("aip.admin.group.error.exceedMax");
            $.i18n.prop("aip.admin.group.add.folder.default");

            $.i18n.prop("aip.admin.action");
            $.i18n.prop("aip.admin.action.description");
            $.i18n.prop("aip.admin.action.actionItem.title");

            $.i18n.prop("aip.admin.action.add.actionItem");
            $.i18n.prop("aip.admin.action.add.error.exceedMax");
            $.i18n.prop("aip.admin.action.add.maxLength");
            $.i18n.prop("aip.admin.action.add.description.placeholder");
            $.i18n.prop("aip.admin.action.open");
            $.i18n.prop("actionItem.title.unique");
            $.i18n.prop("aip.admin.action.add.success");
            $.i18n.prop("aip.admin.action.add.jaws");
            $.i18n.prop("aip.admin.action.open.jaws");
            $.i18n.prop("aip.admin.action.open.tab.content");
            $.i18n.prop("aip.admin.action.open.tab.template");
            $.i18n.prop("aip.admin.action.open.tab.content.noItem1");
            $.i18n.prop("aip.admin.action.open.tab.content.noItem2");
            $.i18n.prop("aip.admin.action.open.tab.content.noContent");
            $.i18n.prop("aip.admin.action.open.tab.content.edit");
            $.i18n.prop("aip.admin.action.open.tab.content.templateSelect");
            $.i18n.prop("aip.admin.action.open.tab.content.templateContent");

            $.i18n.prop("aip.admin.selectable.action.items");
            $.i18n.prop("aip.admin.selectable.groups");

            $.i18n.prop("aip.list.grid.groupTitle");
            $.i18n.prop("aip.list.grid.itemTitle");
            $.i18n.prop("aip.list.grid.folder");
            $.i18n.prop("aip.list.grid.status");
            $.i18n.prop("aip.list.grid.lastUpdated");
            $.i18n.prop("aip.list.grid.activityDate");

            $.i18n.prop("aip.status.active");
            $.i18n.prop("aip.status.inactive");
            $.i18n.prop("aip.status.pending");
            $.i18n.prop("aip.status.complete");

            $.i18n.prop("aip.character.astrick");
            $.i18n.prop("aip.ckeditor.keyhelp");

            $.i18n.prop("aip.user.actionItem.list");
            $.i18n.prop("aip.user.list.header.title.registration");
            $.i18n.prop("aip.user.list.header.description.registration");
            $.i18n.prop("aip.user.list.header.title.graduation");
            $.i18n.prop("aip.user.list.header.description.graduation");

            $.i18n.prop("aip.user.detail.button.proceed");
            $.i18n.prop("aip.user.detail.button.confirm");
            $.i18n.prop("aip.user.detail.button.deny");
            $.i18n.prop("aip.user.detail.button.return");

            $.i18n.prop("aip.operation.not.permitted");

            $templateCache.put("adminActionItemOpenOverview.html",
                '<div class="actionItemElement actionItemDetail col-xs-12 col-sm-8"> \
                    <h3>{{"aip.list.grid.itemTitle"|i18n_aip}}</h3> \
                    <p class="openActionItemTitle">{{vm.actionItem.title}}</p> \
                    <h3>{{"aip.common.folder"|i18n_aip}}</h3> \
                    <p class="openActionItemFolder">{{vm.actionItem.folder.name}}</p> \
                    <h3>{{"aip.common.status"|i18n_aip}}</h3> \
                    <p class="openActionItemStatus">{{vm.actionItem.status}}</p> \
                    <h3>{{"aip.common.description"|i18n_aip}}</h3> \
                    <p class="openActionItemDesc">{{vm.actionItem.description}}</p> \
                </div> \
                <div class="hidden-xs col-sm-1 dividerContainer" ng-style="vm.getSaparatorHeight()"> \
                    <div class="divider"></div> \
                </div> \
                <div class="actionItemElement col-xs-12 col-sm-3"> \
                    <h3>{{"aip.common.activity"|i18n_aip}}</h3> \
                <hr /> \
                <div class="actionItemElement"> \
                    <h4>{{"aip.common.last.updated.by"|i18n_aip}}</h4> \
                <p class="openActionItemLastUpdatedBy">{{vm.actionItem.creatorId}}</p> \
                </div> \
                <hr /> \
                <div class="actionItemElement"> \
                        <h4>{{"aip.common.activity.date"|i18n_aip}}</h4> \
                    <p class="openActionItemActivityDate">{{vm.actionItem.activityDate}}</p> \
                    </div> \
                </div>'
            );

            CKEDITOR.on( 'instanceCreated', function( event ) {
                var editor = event.editor,
                        element = editor.element;
                    // Customize the editor configurations on "configLoaded" event,
                    // which is fired after the configuration file loading and
                    // execution. This makes it possible to change the
                    // configurations before the editor initialization takes place.
                    editor.on( 'configLoaded', function() {
                        // Remove unnecessary plugins to make the editor simpler.
                        editor.config.removePlugins = 'flash,forms,iframe,newpage,smiley';
                        var helpLabel = $.i18n.prop("aip.ckeditor.keyhelp");

                        editor.ui.addButton( 'A11YBtn', {
                            label: helpLabel,
                            command: 'a11yHelp',
                            toolbar: 'about'
                        } );

                        // Rearrange the layout of the toolbar.
                        editor.config.toolbar = [
                         { name: 'document', items: [ 'Source' ] },
                         { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                         { name: 'editing', items: [ 'Scayt' ] },
                         { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                         { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
                         { name: 'tools', items: [ 'Maximize' ] },
                         '/',
                         { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
                         { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                         { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
                         { name: 'styles', items: [ 'Styles', 'Format' ] },
                         { name: 'about', items: [ 'About','A11YBtn' ] }
                         ];
                    });
            });

    }]
);


var bannerAIPUI = angular.module("bannerAIPUI", [])
    //set application root url
    .constant('APP_ROOT', aipAppRoot)

    //supply directives' template url so that we don't have any hardcoded url in other code
    .config(['$provide', 'APP_ROOT', function($provide, APP_ROOT) {
        //override angular-ui's default accordion-group directive template; h4 -> h2 for title
        $provide.decorator('uibAccordionGroupDirective', function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/list/template/listAccordionHeader.html";
            return $delegate;
        });
        $provide.decorator("aipListDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/list/template/list.html";
            return $delegate;
        });
        $provide.decorator("aipReadmoreDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/readmore/template/readmore.html";
            return $delegate;
        });
        $provide.decorator("aipLandingItemDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/admin/landing-item/template/landingItem.html";
            return $delegate;
        });
        $provide.decorator("aipItemDetailDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/item-detail/template/itemDetail.html";
            return $delegate;
        });

        $provide.decorator("aipGroupDetailDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/admin/group-detail/template/groupDetail.html";
            return $delegate;
        });
    }]
);


// Override common components
angular.module("templates/tabNav.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("templates/tabNav.html",
            "<div class=\"xe-tab-container\" role=\"presentation\"><ul class=\"xe-tab-nav\" role=\"tablist\"><li ng-repeat=\"tab in tabnav.tabs\" ng-click=\"tabnav.activate(tab)\" ng-class=\"{active: tab.active}\" ng-repeat-complete aria-controls=\"{{'xe-tab-panel'+ ($index+1)}}\" aria-selected=\"{{tab.active}}\" tabindex=\"-1\"><a ui-sref=\"{{ tab.state && tab.state || '#' }}\" href=\"#\" id=\"{{'xe-tab'+ ($index+1)}}\" title=\"{{tab.heading}}\" ng-if=\"tab.state\">{{tab.heading}} <span></span></a> <a href=\"javascript:void(0)\;\" role=\"tab\" id=\"{{'xe-tab'+ ($index+1)}}\" title=\"{{tab.heading}}\" ng-if=\"!tab.state\" aria-selected=\"{{tab.active}}\">{{tab.heading}} <span></span></a></li></ul><div class=\"xe-tab-content\" role=\"presentation\"><ng-transclude></ng-transclude></div></div>");
}]);
