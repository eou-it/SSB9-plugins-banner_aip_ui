/** *****************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

modules = {

    'bannerAIPUI' {
        dependsOn 'angularApp'
        dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, bootstrap, commonComponents, commonComponentsLTR'
        dependsOn 'font-awesome'
        resource url: [plugin: 'banner-aip-ui', file: 'js/angular-ui-bootstrap/dist/ui-bootstrap-csp.css']
        resource url: [plugin: 'banner-aip-ui', file: 'css/aip-main.css']
        resource url: [plugin: 'banner-aip-ui', file: 'css/iconFonts.css']
    }
    'bannerAIPUIRTL' {
        dependsOn 'angularApp'
        dependsOn 'bannerSelfServiceCommonRTL, extensibilityCommonRTL, extensibilityAngularRTL, bootstrapRTL, commonComponents, commonComponentsRTL'
        dependsOn 'font-awesome'
        resource url: [plugin: 'banner-aip-ui', file: 'js/angular-ui-bootstrap/dist/ui-bootstrap-csp-rtl.css']
        resource url: [plugin: 'banner-aip-ui', file: 'css/aip-main-rtl.css']
        resource url: [plugin: 'banner-aip-ui', file: 'css/aip-main-rtl-patch.css']
        resource url: [plugin: 'banner-aip-ui', file: 'css/iconFonts-rtl.css']
    }
    'bannerAdminAIPUI' {
        dependsOn 'bannerAIPUI'
        dependsOn 'bannerAdminAIPApp'
    }
    'bannerNonAdminAIPUI' {
        dependsOn 'bannerAIPUI'
        dependsOn 'bannerNonAdminAIPApp'
    }
    'bannerAIPReviewUI' {
        dependsOn 'bannerAIPUI'
        dependsOn 'bannerAIPReviewApp'
    }
    'bannerAdminAIPUIRTL' {
        dependsOn 'bannerAdminAIPApp'
        dependsOn 'bannerAIPUIRTL'
    }
    'bannerNonAdminAIPUIRTL' {
        dependsOn 'bannerNonAdminAIPApp'
        dependsOn 'bannerAIPUIRTL'
    }
    'bannerAIPReviewUIRTL' {
        dependsOn 'bannerAIPReviewApp'
        dependsOn 'bannerAIPUIRTL'
    }
    'bannerAIPUtils' {
        resource url: [plugin: 'banner-aip-ui', file: 'js/angular-aria.js']
        // resource url:[plugin: 'banner-aip-ui', file: 'js/ng-ckeditor/libs/ckeditor/ckeditor.js']
        resource url: [plugin: 'banner-aip-ui', file: 'js/ng-ckeditor/ng-ckeditor.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/filters/i18n-filter.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/filters/html-filter.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/utils/register.js']
        resource url: [plugin: 'banner-aip-ui', file: 'js/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
    }

    'commonComponents' {
        resource url: [file: 'js/d3/d3.min.js']
        resource url: [file: 'js/xe-components/xe-ui-components.js']
    }
    'commonComponentsLTR' {
        dependsOn 'commonComponents'
        resource url: [file: 'css/xe-components/xe-ui-components.min.css']
    }
    'commonComponentsRTL' {
        dependsOn 'commonComponents'
        resource url: [file: 'css/xe-components/xe-ui-components-rtl.min.css']
    }

    'bannerCommonAIPApp' {

        dependsOn 'bannerAIPUtils'
        dependsOn "bannerSelfService, i18n-core"
        dependsOn "bannerAIPPB"

        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/aipcommon.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/itemListViewService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/aipReviewService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/breadcrumbService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/userService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/spinnerService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/aipAttachmentService.js']

        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/list/js/list.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/readmore/js/readmore.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/calendar-directive.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/item-detail/js/itemDetail.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/utils/spinnerCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/pagebuilder/js/aip-pagebuilder.js']

        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/filters/blockProcessItem-filter.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/filters/select2-groupAssign-filter.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/cm-timepicker.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/angular-dateparser.min.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/aip-attachment/js/aipAttachment.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/file-upload.js']
    }

    'bannerNonAdminAIPApp' {

        dependsOn "bannerCommonAIPApp"
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/nonAdminApp.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/listItem/listItemPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/listItem/itemConfirm/itemConfirmCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/listItem/itemInform/itemInformCtrl.js']
    }

    'bannerAIPReviewApp' {

        dependsOn "bannerCommonAIPApp"
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/aipReviewApp.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/aipReview/monitorActionItem/monitorActionItemCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/aipReview/reviewActionItem/reviewActionItemCtrl.js']
    }

    'bannerAdminAIPApp' {

        dependsOn "bannerCommonAIPApp"
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/adminApp.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/landing-item/js/landingItem.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/group-detail/js/groupDetail.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/status-rule/js/statusRule.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/blockedProcess/js/blockedProcess.js']

        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/adminLandingPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/group/add/adminGroupAddPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/group/open/adminGroupOpenPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/group/list/adminGroupListPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/list/adminActionListPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/postActionListPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/recurringPostActionListPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/adminPostItemAddPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/add/adminActionItemAddPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/open/adminActionItemOpenPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/open/block/adminActionItemBlockProcessCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/status/list/adminStatusListPageCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/status/list/add/statusAddModalCtrl.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/addpost/postAddModalCtrl.js']

        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/admin/adminActionStatusService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/admin/adminActionService.js']
        resource url: [plugin: 'banner-aip-ui', file: 'aipApp/common/services/admin/adminGroupService.js']
    }

    // Resources for PageBuilder

    'bannerAIPPB' {
        resource url: [plugin: 'banner-sspb', file: "BannerXE/lib/ng-upload/ng-upload.js"]
        resource url: [plugin: 'banner-sspb', file: "BannerXE/lib/ng-grid/ng-grid.js"]
        resource url: [plugin: 'banner-sspb', file: "BannerXE/lib/angular-ui/angular-ui.js"]
        resource url: [plugin: 'banner-sspb', file: "js/pbRunApp.js"]
        resource url: [plugin: 'banner-sspb', file: 'js/pbRunDirectives.js']
        resource url: [plugin: 'banner-sspb', file: 'BannerXE/lib/jquery/jquery-ui-1.8.24.custom.js'], disposition: 'head'
    }

    'bannerAIPPBLTR' {
        dependsOn "bannerAIPUI, bannerAIPPB , bannerAdminAIPUI ,bannerNonAdminAIPUI"
        resource url: [plugin: 'banner-sspb', file: 'BannerXE/css/jquery-ui.css']
        resource url: [plugin: 'banner-sspb', file: 'BannerXE/css/ng-grid.css']
        resource url: [plugin: 'banner-sspb', file: 'BannerXE/css/angular-ui.css']
    }

    // End of PageBuilder resources


}
