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
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-resource/angular-resource.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-aria/angular-aria.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
        resource url: [plugin: 'banner-csr-ui', file: 'node_modules/moment/min/moment.min.js']
//        resource url:[plugin: 'banner-csr', file: 'bower_components/angular-common/build/angular-common.js']
    }

    'csrCheck' {
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/csrCheck.js']
    }
    'bannerCSRUI' {
        dependsOn 'csr-angular'
        dependsOn 'bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, common-components, angularApp, bootstrap'
        dependsOn 'bannerCSRApp'
        dependsOn 'font-awesome'
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/aip-main.css']
    }
    'bannerCSRUIRTL' {
        dependsOn 'bannerCSRUI'
        dependsOn 'bannerSelfServiceCommonRTL, extensibilityAngularRTL'
        resource url:[plugin: 'banner-ui-ss', file: 'bootstrap/css/bootstrap-rtl.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components-rtl.css']
        resource url:[plugin: 'banner-csr-ui', file: 'css/aip-main-rtl.css']
    }
    'bannerCSRUtils' {
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/filters/i18n-filter.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/utils/register.js']
    }
    'bannerCSRApp' {
        dependsOn 'bannerCSRUtils'
        dependsOn "bannerSelfService, i18n-core"
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/app.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/admin/adminLandingPageCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/admin/group/add/adminGroupAddPageCtrl.js']
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
        resource url:[plugin: 'banner-csr-ui', file: 'aipApp/common/utils/spinnerCtrl.js']
    }

}