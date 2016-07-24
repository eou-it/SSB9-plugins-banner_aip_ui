/**
 * Created by jshin on 12/8/15.
 */

/** *****************************************************************************
 Copyright 2009-2012 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

modules = {

    'csr-angular' { // Temp resources
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular/angular.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-route/angular-route.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-animate/angular-animate.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-router/release/angular-ui-router.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-sanitize/angular-sanitize.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-messages/angular-messages.js']
        resource url:[plugin: 'banner-ui-ss',file: 'js/angular/angular-translate.min.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-resource/angular-resource.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-aria/angular-aria.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/moment/min/moment.min.js']
//        resource url:[plugin: 'banner-csr', file: 'bower_components/angular-common/build/angular-common.js']
    }

    'aipCheck' {
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/aipCheck.js']
    }
    'bannerAIPUI' {
        dependsOn 'csr-angular'
       // dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, common-components, common-components-ltr, angularApp, ' +
        //        'bootstrap'
        dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, commonComponents, commonComponentsLTR, angularApp, ' +
                'bootstrap'
        dependsOn 'bannerAIPApp'
        dependsOn 'font-awesome'
        //resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/aip-main.css']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/ckeditor/css/ckEditor.css']
    }
    'bannerAIPUIRTL' {
//        dependsOn 'bannerAIPUI'
        //dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL, common-components, common-components-rtl'
        dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL, commonComponents, commonComponentsRTL'
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap-rtl.css']
        //resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components-rtl.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/aip-main-rtl.css']
    }
    'bannerAIPUtils' {
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/filters/i18n-filter.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/utils/register.js']
    }
    'bannerAIPApp' {
        dependsOn 'bannerAIPUtils'
        dependsOn "bannerSelfService, i18n-core"
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/app.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/admin/adminLandingPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/admin/group/add/adminGroupAddPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/admin/group/open/adminGroupOpenPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/admin/group/list/adminGroupListPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/listItem/listItemPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/listItem/itemConfirm/itemConfirmCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/services/admin/adminGroupService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/services/itemListViewService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/services/breadcrumbService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/services/userService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/services/spinnerService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/admin/landing-item/js/landingItem.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/list/js/list.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/readmore/js/readmore.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/item-detail/js/itemDetail.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/admin/group-detail/js/groupDetail.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/utils/spinnerCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/utils/dataGridCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/directives/ckeditor/js/ckEditor.js']
    }

    'commonComponents' {
        resource url:[plugin: 'banner-csr-ui', file: 'js/xe-components/xe-ui-components.js']
    }
    'commonComponentsLTR' {
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components.min.css']
    }
    'commonComponentsRTL' {
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components-rtl.min.css']
    }

}