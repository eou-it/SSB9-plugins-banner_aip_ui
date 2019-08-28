/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/

//angular.module("bannerAIP").service( 'breadcrumbService', ['$filter', '$rootScope', function ($filter, $rootScope) {
angular.module("bannerCommonAIP").service( 'breadcrumbService', ['$filter', '$rootScope', function ($filter, $rootScope) {
    var constantBreadCrumb = [],
        callingUrl,
        CALLING_URL = 1,
        GEN_LANDING_PAGE_SIGNATURE;



    $rootScope.applicationContextRoot = $('meta[name=applicationContextRoot]').attr("content");
    GEN_LANDING_PAGE_SIGNATURE = new RegExp($rootScope.applicationContextRoot +'/ssb/general$');

    console.log("ApplicationContext", $rootScope.applicationContextRoot);

    this.reset = function() {
        var label;

        constantBreadCrumb = [
            {
                label: 'aip.admin.landing',
                url: ''
            }
        ];

        callingUrl = sessionStorage.getItem('genAppCallingPage');

        if (callingUrl) {
            label = GEN_LANDING_PAGE_SIGNATURE.test(callingUrl) ? 'banner.generalssb.landingpage.title' : 'default.paginate.prev';

            constantBreadCrumb.splice(0, 0, {
                label: label,
                url: CALLING_URL
            });
        }
    };

    this.setBreadcrumbs = function (bc) {
        this.reset();
        constantBreadCrumb = constantBreadCrumb.concat(bc);
    };

    this.checkSkip = function(newVal, oldVal) {
        if (oldVal === "aip.admin.group.add" && newVal === "aip.admin.group.open") {
            return true;
        }
        if (oldVal === "aip.admin.group.open" && newVal === "aip.admin.group.add") {
            return true;
        }
        if (oldVal === "aip.admin.action.add.actionItem" && newVal === "aip.admin.action.open") {
            return true;
        }
        if (oldVal === "aip.admin.action.open" && newVal === "aip.admin.action.add.actionItem") {
            return true;
        }
        return false;
    };

    this.refreshBreadcrumbs = function() {
        var breadCrumbInputData = {},
            updatedHeaderAttributes,
            backButtonUrl = '',
            registerBackButtonClickListenerOverride = function(location) {
                $('#breadcrumbBackButton').on('click',function(){
                    window.location = location;
                })
            };

        _.each (constantBreadCrumb, function(item) {
            var label = ($filter('i18n_aip')(item.label));

            if (item.url) {
                if (item.url === CALLING_URL) {
                    breadCrumbInputData[label] = callingUrl;
                    backButtonUrl = callingUrl;
                } else {
                    breadCrumbInputData[label] = "/" + document.location.pathname.slice(Application.getApplicationPath().length + 1) + "#" + item.url;
                }
            } else {
                breadCrumbInputData[label] = "";
            }
        });

        updatedHeaderAttributes = {
            "breadcrumb":breadCrumbInputData
        };

        BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);

        // As this is in a consolidated app, the default "previous breadcrumb" logic needs to be overridden to
        // point the back button to the calling page URL.  (Note that the back button is only used for mobile,
        // not desktop.)
        registerBackButtonClickListenerOverride(backButtonUrl);
    };
}]);
