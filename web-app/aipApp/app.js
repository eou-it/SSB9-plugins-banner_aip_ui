// angular module init and configuration
"use strict";

var aipAppRoot = "/" + extensibilityInfo.application + "/plugins/" +
    window.aipApp.fileSystemName + "/aipApp/";
var aipAppAbsPath = window.location.protocol + "//" + window.location.host + Application.getApplicationPath() + "/";
var bcmRoot = window.location.protocol +  Application.getApplicationPath();


// required global variables for PageBuilder render
var params = {};
var rootWebApp = aipAppAbsPath.replace("/ssb/","/");
var resourceBase = rootWebApp+'internalPb/';


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
    "ngRoute",
    "SCEAIP",
    "ngCkeditor",
    "BannerOnAngular",
    "I18nAIP",
    "pbrun.directives"
    ])

//set application root url
    .constant('APP_ROOT', aipAppRoot)

    .constant('BCM_ROOT',bcmRoot)

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
                url: "/aip/admin#/status"
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
            adminActionItemStatus: aipAppAbsPath + "aip/adminGroupStatus", //todo: replace with future lookup table and rename
            actionItemStatusList: aipAppAbsPath + "aipAdmin/actionItemStatusList", //simple list of statuses
            actionItemStatusGrid: aipAppAbsPath + "aipAdmin/actionItemStatusGridList", //filterable list for grid functionality
            createActionItem: aipAppAbsPath + "aipAdmin/addActionItem",
            editActionItemContent: aipAppAbsPath + "aipAdmin/editActionItemContent",
            openActionItem: aipAppAbsPath + "aipAdmin/openActionItem",
            actionItemTemplateList: aipAppAbsPath + "aipAdmin/actionItemTemplateList",
            saveActionItemTemplate: aipAppAbsPath + "aipAdmin/updateActionItemDetailWithTemplate",
            statusSave: aipAppAbsPath + "aipAdmin/statusSave",
            removeStatus:aipAppAbsPath + "aipAdmin/removeStatus",
            rulesByActionItem: aipAppAbsPath + "aipAdmin/actionItemStatusRulesByActionItemId",
            updateActionItemStatusRule: aipAppAbsPath + "aipAdmin/updateActionItemStatusRule",
            blockedProcessList: aipAppAbsPath + "aipAdmin/blockedProcessList",
            updateBlockedProcessItems: aipAppAbsPath + "aipAdmin/updateBlockedProcessItems"
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
             /*todo: this config actually doesn't load but needs to be cleaned up when minify ng-ckeditor build issues are resolved*/
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
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider",  "$httpProvider", "$windowProvider", "PAGES", "APP_ROOT", "APP_ABS_PATH",
        function($stateProvider, $urlRouteProvider, $locationProvider, $httpProvider, $windowProvider,
                 PAGES, APP_ROOT, APP_ABS_PATH) {
// TODO: should this be HTML5 in HashBang mode with a base defined in the HTML?
            //$qProvider.errorOnUnhandledRejections(false);
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('');
            $urlRouteProvider.otherwise("/list");
            angular.forEach(PAGES, function(item, state) {
                $stateProvider.state(state, {
                    url: item.url,
                    templateUrl: APP_ROOT + item.templateUrl,
                    controller: item.controller,
                    params: {noti:undefined, data:undefined, inform: item.inform, saved:undefined},
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
        function($rootScope, $state, $stateParams, $filter, $sce, $templateCache, BreadcrumbService) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            //when state successfully changed, update breadcrumbs
            $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
                BreadcrumbService.updateBreadcrumb(toState.data.breadcrumbs);
            });
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
                //console.log("state change start");
            });
            $rootScope.$on("$stateNotFound", function(err) {

            });


            // $templateCache.put('adminActionItemOpenOverview.html', '<div class="actionItemElement actionItemDetail col-xs-12 col-sm-8"><h3>{{"aip.list.grid.itemTitle"|i18n_aip}}</h3><p class="openActionItemTitle">{{vm.actionItem.title}}</p><h3>{{"aip.common.folder"|i18n_aip}}</h3></div><div class="hidden-xs col-sm-1 dividerContainer" ng-style="vm.getSaparatorHeight()"><div class="divider"></div></div><div class="actionItemElement col-xs-12 col-sm-3"><h3>{{"aip.common.activity"|i18n_aip}}</h3><hr /><div class="actionItemElement"><h4>{{"aip.common.last.updated.by"|i18n_aip}}</h4><p class="openActionItemLastUpdatedBy">{{vm.actionItem.creatorId}}</p></div><hr /><div class="actionItemElement"> <h4>{{"aip.common.activity.date"|i18n_aip}}</h4><p class="openActionItemActivityDate">{{vm.actionItem.activityDate}}</p></div></div>');


            //expose message.properties values for taglib
            //TODO:: find better way to handle this.
            //TODO:: use array and parse array in taglib
            // FIXME: refactor code to namespace to aip.*

            $.i18n.prop("actionItem.title.unique.error");

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

                        editor.config.height='30em',
                        editor.config.width='100%',

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
                         { name: 'styles', items: [ 'Format', 'Font', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
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
        $provide.decorator("aipStatusRuleDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/admin/status-rule/template/statusRule.html";
            return $delegate;
        });
        $provide.decorator("aipBlockedProcessDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/admin/blockedProcess/template/blockedProcess.html";
            return $delegate;
        });
    }]
);


// Override common components
/*tab navigation*/
angular.module("templates/tabNav.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("templates/tabNav.html",
            "<div class=\"xe-tab-container\" role=\"presentation\"><ul class=\"xe-tab-nav\" role=\"tablist\"><li ng-repeat=\"tab in tabnav.tabs\" ng-click=\"tabnav.activate(tab)\" ng-class=\"{active: tab.active}\" ng-repeat-complete aria-controls=\"{{'xe-tab-panel'+ ($index+1)}}\" aria-selected=\"{{tab.active}}\" tabindex=\"-1\"><a ui-sref=\"{{ tab.state && tab.state || '#' }}\" href=\"#\" id=\"{{'xe-tab'+ ($index+1)}}\" title=\"{{tab.heading}}\" ng-if=\"tab.state\">{{tab.heading}} <span></span></a> <a href=\"javascript:void(0)\;\" role=\"tab\" id=\"{{'xe-tab'+ ($index+1)}}\" title=\"{{tab.heading}}\" ng-if=\"!tab.state\" aria-selected=\"{{tab.active}}\">{{tab.heading}} <span></span></a></li></ul><div class=\"xe-tab-content\" role=\"presentation\"><ng-transclude></ng-transclude></div></div>");
}]);
/*grid*/

angular.module("templates/dataTable.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("templates/dataTable.html",
            "<div id=\"{{tableId}}\" class=\"table-container\" ng-class=\"{'fixed-height': !!height, 'noToolbar': noCaptionAndToolbar, 'no-data': !resultsFound, 'empty': emptyTableMsg}\" browser-detect role=\"grid\" aria-labelledby=\"gridCaption\" ng-cloak><div class=\"caption\" ng-if=\"::!noCaptionBar\" xe-section=\"{{xeSection + 'CaptionBar'}}\"><table class=\"data-table\" title=\"{{'aip.admin.selectable.action.items'|i18n_aip}}\"><caption ng-class=\"{'search-opened': hideContainer}\"><span id=\"gridCaption\" class=\"caption-container font-semibold\" ng-if=\"::!nocaption\" ng-bind=\"::caption\" xe-field=\"caption\"></span><div class=\"toolbar\" ng-if=\"toolbar\"><xe-toolbar></xe-toolbar><xe-column-filter></xe-column-filter><span role=\"search\" title=\"{{'search.shortcut.label' | xei18n}}\" ng-if=\"::!nosearch\"><xe-search value=\"searchConfig.searchString\" place-holder=\"{{'search.label' | xei18n}}\" on-change=\"fetchSpecial(query)\" on-focus=\"onSearchFocus({event: event})\" on-blur=\"onSearchBlur({event: event})\" search-config=\"searchConfig\" loading-data=\"loadingData\"></xe-search></span></div></caption></table></div><div class=\"hr-scrollable-content\"><div class=\"thead\"><table class=\"data-table\" ng-style=\"headerPadding\"><thead role=\"rowgroup\"><tr role=\"row\"><th class=\"font-semibold width-animate {{::heading.name}}\" ng-repeat=\"heading in header\" ng-class=\"{'sortable': heading.options.sortable, 'ascending': sortArray[heading.name].ascending, 'decending': sortArray[heading.name].decending}\" ng-if=\"heading.options.visible === true\" ng-style=\"{'width': heading.dynamicWidth + 'px'}\" data-name=\"{{::heading.name}}\" ng-click=\"onSort({heading: heading}); sortOnHeading(heading, $index);\" role=\"columnheader\" aria-sort=\"{{sortArray[heading.name].ascending ? ('dataTable.sort.ascending.label' | xei18n) : (sortArray[heading.name].decending ? ('dataTable.sort.descending.label' | xei18n) : 'none')}}\" drag-drop=\"handleDrop\" tabindex=\"0\" xe-field=\"{{::heading.name}}\" xe-heading-injector><div class=\"data\" title=\"{{heading.label}}\"><span ng-show=\"::heading.options.titleVisible !== false\" aria-hidden=\"false\" ng-bind=\"::heading.title\"></span><label id=\"${{'headingAria' + $index}}\" class=\"sr-only\" ng-bind=\"(heading.options.sortable ? ('dataTable.sortable.label' | xei18n) : '')\"></label></div></th></tr></thead></table></div><div class=\"tbody\" ng-style=\"::{'height': height}\" continuous-scroll=\"nextPage()\" scroll-parent=\"{{::continuousScrollParent}}\" aria-labelledby=\"msg\" tabindex=\"{{(!resultsFound || emptyTableMsg) ? 0 : ''}}\" resize><div id=\"msg\" ng-bind=\"emptyTableMsg? emptyTableMsg : ((!resultsFound && !loadingData) ? noDataMsg : '')\"></div><table class=\"data-table\" ng-class=\"::mobileLayout ? 'mobileLayout' : 'noMobileLayout'\"><thead aria-hidden=\"true\"><tr><th class=\"font-semibold {{::heading.name}}\" ng-repeat=\"heading in header\" ng-class=\"{'sortable': heading.options.sortable, 'ascending': sortArray[heading.name].ascending, 'decending': sortArray[heading.name].decending}\" ng-if=\"heading.options.visible === true\" ng-style=\"{'width': heading.dynamicWidth + 'px'}\" data-name=\"{{::heading.name}}\" xe-field=\"{{::heading.name}}\" xe-heading-injector tab-index><div class=\"data\"><span ng-show=\"::heading.options.titleVisible !== false\" ng-bind=\"::heading.title\"></span></div></th></tr></thead><tbody role=\"rowgroup\"><tr ng-repeat=\"row in content\" ng-click=\"onRowClick({data:row,index:$index})\" ng-dblclick=\"onRowDoubleClick({data:row,index:$index})\" xe-row-injector tabindex=\"-1\" role=\"row\"><td class=\"width-animate\" ng-repeat=\"heading in header\" ng-class=\"{'align-right': heading.options.actionOrStatus, 'sortable': heading.options.sortable}\" ng-if=\"heading.options.visible === true\" data-name=\"{{::heading.name}}\" data-title=\"{{::(heading.title && heading.options.titleVisible !== false) ? heading.title + ':' : ''}}\" attain-mobile-layout=\"{{mobileLayout[heading.name]}}\" xe-field=\"{{::heading.name}}\" xe-cell-injector tab-index role=\"gridcell\" ng-cloak>{{getObjectValue(row, heading.name)}}</td></tr></tbody></table></div></div><div class=\"tfoot\" ng-transclude></div><xe-pagination model=\"content\" results-found=\"resultsFound\" ng-show=\"showPagination\" search-string=\"searchConfig.searchString\"></xe-pagination><div ng-show=\"loadingData\" class=\"load-indicator\"><div class=\"spinner\"><div class=\"bounce1\"></div><div class=\"bounce2\"></div><div class=\"bounce3\"></div></div></div></div>");
}]);



angular.module("BannerOnAngular")
//set application root url
    .constant('APP_ROOT', aipAppRoot)
    .constant('BCM_ROOT',bcmRoot)
    .constant('APP_PATH', Application.getApplicationPath())
    .constant("APP_ABS_PATH", aipAppAbsPath)
    .constant("params", params)

    .config(['$provide', 'APP_ROOT','params', function($provide, APP_ROOT, params) {
        $provide.decorator("pagebuilderPageDirective", function($delegate) {
            var directive = $delegate[0];
            directive.templateUrl = APP_ROOT + "common/directives/pagebuilder/template/aip-pagebuilder.html";
            return $delegate;
        });
        params.saved=false;
    }]);


