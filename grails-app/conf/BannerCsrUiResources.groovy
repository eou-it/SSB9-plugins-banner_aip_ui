/**
 * Created by jshin on 12/8/15.
 */

/** *****************************************************************************
 Copyright 2009-2012 Ellucian Company L.P. and its affiliates.
 ****************************************************************************** */

modules = {
    'csr-angular' { // Temp resources
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular/angular.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-route/angular-route.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-animate/angular-animate.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-router/release/angular-ui-router.min.js']
//        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-router/release/angular-ui-router.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-sanitize/angular-sanitize.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-messages/angular-messages.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-resource/angular-resource.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
//        resource url:[plugin: 'banner-csr', file: 'bower_components/angular-common/build/angular-common.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-aria/angular-aria.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/moment/moment.js']
    }
    'csrCheck' {
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/csrCheck.js']
    }
    'bannerCSRUI' {
        dependsOn 'csr-angular'
        dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, common-components, angularApp, bootstrap'
        dependsOn 'bannerCSRApp'
        dependsOn "bannerSelfService, i18n-core"
        dependsOn 'font-awesome'
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/csr-main.css']
    }
    'bannerCSRUIRTL' {
        dependsOn 'bannerCSRUI'
        dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL'
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap-rtl.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components-rtl.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/csr-main-rtl.css']
    }
    'bannerCSRUtils' {
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/filters/i18n-filter.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/utils/register.js']
    }
    'bannerCSRApp' {
        dependsOn 'bannerCSRUtils'
        dependsOn "bannerSelfService, i18n-core"
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/app.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/admin/adminLandingPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/admin/listActionItem/adminListItemPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/listItem/listItemPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/listItem/itemConfirm/itemConfirmCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/itemListViewService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/adminItemListViewService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/csrBreadcrumbService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/csrUserService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/csrSpinnerService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/directives/admin/csr-landing-item/js/csrLandingItem.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/directives/csr-list/js/csrList.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/directives/csr-readmore/js/csrReadmore.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/directives/csr-item-detail/js/csrItemDetail.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/utils/csrSpinnerCtrl.js']
    }

}