/**
 * Created by jshin on 12/8/15.
 */

/** *****************************************************************************
 Copyright 2009-2012 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

modules = {
    overrides {
        'extensibilityAngular' {
            dependsOn 'aip-angular'
            dependsOn "extensibilityCommon"
            resource url: [plugin: 'web-app-extensibility', file: 'js/extensibility-angular/xe-angular.js']
        }
    }

    'aip-angular' { // Temp resources
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular/angular.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-route/angular-route.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-animate/angular-animate.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-ui-router/release/angular-ui-router.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-sanitize/angular-sanitize.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-messages/angular-messages.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-translate/dist/angular-translate.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-resource/angular-resource.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-aria/angular-aria.js']

        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/moment/min/moment.min.js']
       // resource url: [plugin: 'banner-aip-ui', file: 'node_modules/ckeditor/ckeditor.js']

       // resource url: [plugin: 'banner-aip-ui', file: 'bower_components/ng-ckeditor/ng-ckeditor.js']
        //resource url: [plugin: 'banner-aip-ui', file: 'bower_components/ng-ckeditor/libs/ckeditor/ckeditor.js']
        resource url: [plugin: 'banner-aip-ui', file: 'bower_components/ng-ckeditor/ng-ckeditor.min.js']
//        resource url:[plugin: 'banner-aip', file: 'bower_components/angular-common/build/angular-common.js']
    }

    'aipCheck' {
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/aipCheck.js']
    }
    'bannerAIPUI' {
        dependsOn 'aip-angular'
       // dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, common-components, common-components-ltr, angularApp, ' +
        //        'bootstrap'
        dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, commonComponents, commonComponentsLTR, ' +
                'bannerSelfServiceAngular, bootstrap'
        dependsOn 'bannerAIPApp'
        dependsOn 'font-awesome'
        //resource url:[plugin: 'banner-aip-ui', file: 'css/xe-ui-components.css']
        resource url:[plugin: 'banner-aip-ui', file: 'css/aip-main.css']
        resource url:[plugin: 'banner-aip-ui', file: 'css/iconFonts.css']
        //resource url:[plugin: 'banner-aip-ui', file: 'node_modules/ckeditor/contents.css']
    }
    'bannerAIPUIRTL' {
        dependsOn 'bannerAIPUI'
        //dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL, common-components, common-components-rtl'
        dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL, commonComponentsRTL, bootstrapRTL'
//        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap-rtl.css']
        //resource url:[plugin: 'banner-aip-ui', file: 'css/xe-ui-components-rtl.css']
        resource url:[plugin: 'banner-aip-ui', file: 'css/aip-main-rtl.css']
    }
    'bannerAIPUtils' {
        resource url: [plugin: 'banner-aip-ui', file: 'bower_components/ng-ckeditor/ng-ckeditor.min.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/i18n-filter.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/html-filter.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/utils/register.js']
        resource url: [plugin: 'banner-aip-ui', file: 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
    }
    'bannerAIPApp' {
        dependsOn 'bannerAIPUtils'
        dependsOn "bannerSelfService, i18n-core"
        dependsOn "bannerAIPPB"
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/app.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/adminLandingPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/add/adminGroupAddPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/open/adminGroupOpenPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/list/adminGroupListPageCtrl.js']
        //resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/order/adminGroupOrderPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/list/adminActionListPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/add/adminActionItemAddPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/open/adminActionItemOpenPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/open/block/adminActionItemBlockProcessCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/status/list/adminStatusListPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/status/list/add/statusAddModalCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/listItem/listItemPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/listItem/itemConfirm/itemConfirmCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/listItem/itemInform/itemInformCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/admin/adminGroupService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/admin/adminActionService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/admin/adminActionStatusService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/itemListViewService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/breadcrumbService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/userService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/spinnerService.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/landing-item/js/landingItem.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/list/js/list.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/readmore/js/readmore.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/item-detail/js/itemDetail.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/group-detail/js/groupDetail.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/status-rule/js/statusRule.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/blockedProcess/js/blockedProcess.js']

        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/utils/spinnerCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/pagebuilder/js/aip-pagebuilder.js']

        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/blockProcessItem-filter.js']
    }
    'commonComponents' {
        dependsOn 'aip-angular'
        resource url:[plugin: 'banner-aip-ui', file: 'js/xe-components/xe-ui-components.js']
    }
    'commonComponentsLTR' {
        dependsOn 'commonComponents'
        resource url:[plugin: 'banner-aip-ui', file: 'css/xe-ui-components.css']
    }
    'commonComponentsRTL' {
        dependsOn 'commonComponents'
        resource url:[plugin: 'banner-aip-ui', file: 'css/xe-ui-components-rtl.css']
    }

    'bannerSelfServiceAngular' {
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular/load-angular-locale.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular/angular-resource.min.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular/lrInfiniteScroll.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/moment.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular/angular-common.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/locale-numeric-input/custom-number-input.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/locale-numeric-input/directives/currency-directive.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/locale-numeric-input/directives/decimal-directive.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/locale-numeric-input/directives/percent-directive.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/locale-numeric-input/directives/only-number.js']
        resource url:[plugin: 'banner-ui-ss', file: 'css/custom-number-input/custom-number-input.css'],     attrs:[media:'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/locale-numeric-input/services/readonly-service.js']
        resource url:[plugin: 'banner-ui-ss', file: 'js/angular-components/date-picker/directives/date-picker-directive.js']
    }

    // Resources for PageBuilder

    'bannerAIPPB' {
        dependsOn "aip-angular"
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/angular-ui/angular-ui.js"]
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/ng-upload/ng-upload.js"]
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/ng-grid/ng-grid.js"]
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/angular-ui/angular-ui.js"]
        resource url:[plugin: 'banner-sspb', file: "js/pbRunApp.js"]
        resource url:[plugin: 'banner-sspb', file: 'js/pbRunDirectives.js']
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/lib/jquery/jquery-ui-1.8.24.custom.js'] , disposition: 'head'
    }

    'bannerAIPPBLTR' {
        dependsOn "bannerAIPUI, bannerAIPPB"
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/css/jquery-ui.css']
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/css/ng-grid.css']
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/css/angular-ui.css']

    }

    // End of PageBuilder resources


}