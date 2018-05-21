/** *****************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

modules = {

    'bannerAIPUI' {
        dependsOn 'angularApp'
        dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, commonComponents, commonComponentsLTR, bootstrap'
        dependsOn 'font-awesome'
        resource url:[plugin: 'banner-aip-ui', file: 'js/angular-ui-bootstrap/dist/ui-bootstrap-csp.css']
        resource url:[plugin: 'banner-aip-ui', file: 'css/aip-main.css']
        resource url:[plugin: 'banner-aip-ui', file: 'css/iconFonts.css']
    }
    'bannerAdminAIPUI' {
        dependsOn 'bannerAIPUI'
        dependsOn 'bannerAIPApp'
    }
    'bannerNonAdminAIPUI' {
        dependsOn 'bannerAIPUI'
        dependsOn 'bannerNonAdminAIPApp'
    }
    'bannerAIPUIRTL' {
        dependsOn 'bannerAIPUI','bannerAdminAIPUI','bannerNonAdminAIPUI'
        dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL, commonComponentsRTL'
        dependsOn "jquery"
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap-rtl.css'],            attrs: [media: 'screen, projection']
        resource url:[plugin: 'banner-ui-ss', file: 'css/bootstrap-fixes-rtl.css'],                attrs: [media: 'screen, projection']
        resource url:[plugin: 'banner-aip-ui', file: 'js/angular-ui-bootstrap/dist/ui-bootstrap-csp-rtl.css']
        resource url:[plugin: 'banner-aip-ui', file: 'css/aip-main-rtl.css']
    }
    'bannerAIPUtils' {
        resource url:[plugin: 'banner-aip-ui', file: 'js/angular-aria.js']
       // resource url:[plugin: 'banner-aip-ui', file: 'js/ng-ckeditor/libs/ckeditor/ckeditor.js']
        resource url:[plugin: 'banner-aip-ui', file: 'js/ng-ckeditor/ng-ckeditor.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/i18n-filter.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/html-filter.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/utils/register.js']
        resource url:[plugin: 'banner-aip-ui', file: 'js/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
    }


      'bannerCommonAIPApp' {

          dependsOn 'bannerAIPUtils'
          dependsOn "bannerSelfService, i18n-core"
          dependsOn "bannerAIPPB"

          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/aipcommon.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/itemListViewService.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/breadcrumbService.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/userService.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/services/spinnerService.js']

          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/list/js/list.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/readmore/js/readmore.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/calendar-directive.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/item-detail/js/itemDetail.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/utils/spinnerCtrl.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/landing-item/js/landingItem.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/pagebuilder/js/aip-pagebuilder.js']

          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/blockProcessItem-filter.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/filters/select2-groupAssign-filter.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/cm-timepicker.js']
          resource url:[plugin: 'banner-aip-ui', file: 'aipApp/angular-dateparser.min.js']
      }

     'bannerNonAdminAIPApp' {

         dependsOn "bannerCommonAIPApp"
         resource url:[plugin: 'banner-aip-ui', file: 'aipApp/nonAdminApp.js']
         resource url:[plugin: 'banner-aip-ui', file: 'aipApp/listItem/listItemPageCtrl.js']
         resource url:[plugin: 'banner-aip-ui', file: 'aipApp/listItem/itemConfirm/itemConfirmCtrl.js']
         resource url:[plugin: 'banner-aip-ui', file: 'aipApp/listItem/itemInform/itemInformCtrl.js']
     }

    'bannerAIPApp' {

        dependsOn "bannerCommonAIPApp"
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/calendar-directive.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/adminApp.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/landing-item/js/landingItem.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/group-detail/js/groupDetail.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/status-rule/js/statusRule.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/common/directives/admin/blockedProcess/js/blockedProcess.js']

        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/adminLandingPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/add/adminGroupAddPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/open/adminGroupOpenPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/group/list/adminGroupListPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/list/adminActionListPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/postActionListPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/adminPostItemAddPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/add/adminActionItemAddPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/open/adminActionItemOpenPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/open/block/adminActionItemBlockProcessCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/status/list/adminStatusListPageCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/status/list/add/statusAddModalCtrl.js']
        resource url:[plugin: 'banner-aip-ui', file: 'aipApp/admin/action/post/addpost/postAddModalCtrl.js']

        resource url:[plugin :'banner-aip-ui', file: 'aipApp/common/services/admin/adminActionStatusService.js']
        resource url:[plugin :'banner-aip-ui', file: 'aipApp/common/services/admin/adminActionService.js']
        resource url:[plugin :'banner-aip-ui', file: 'aipApp/common/services/admin/adminGroupService.js']
    }

    // Resources for PageBuilder

    'bannerAIPPB' {
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/ng-upload/ng-upload.js"]
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/ng-grid/ng-grid.js"]
        resource url:[plugin: 'banner-sspb', file: "BannerXE/lib/angular-ui/angular-ui.js"]
        resource url:[plugin: 'banner-sspb', file: "js/pbRunApp.js"]
        resource url:[plugin: 'banner-sspb', file: 'js/pbRunDirectives.js']
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/lib/jquery/jquery-ui-1.8.24.custom.js'] , disposition: 'head'
    }

    'bannerAIPPBLTR' {
        dependsOn "bannerAIPUI, bannerAIPPB , bannerAdminAIPUI ,bannerNonAdminAIPUI"
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/css/jquery-ui.css']
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/css/ng-grid.css']
        resource url:[plugin: 'banner-sspb', file: 'BannerXE/css/angular-ui.css']
    }

    // End of PageBuilder resources


}
