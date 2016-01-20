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
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-aria/angular-aria.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-animate/angular-animate.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-router/release/angular-ui-router.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-sanitize/angular-sanitize.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-messages/angular-messages.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-resource/angular-resource.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js']
        resource url:[plugin: 'banner-csr-ui', file: 'node_modules/moment/moment.js']
//        resource url:[plugin: 'banner-csr', file: 'bower_components/angular-common/build/angular-common.js']
    }

    'bannerCSRUI' {
        dependsOn "csr-angular, bannerSelfServiceCommonLTR, extensibilityCommon, extensibilityAngular, angularApp, common-components"
        resource url:[plugin: 'banner-csr-ui', file: 'css/xe-ui-components.css']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/app.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/admin/adminLandingCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/admin/listActionItem/adminListItemCtrl.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/adminItemListViewService.js']
        resource url:[plugin: 'banner-csr-ui', file: 'csrApp/common/services/csrBreadcrumbService.js']
    }
}