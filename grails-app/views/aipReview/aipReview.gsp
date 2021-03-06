<!--*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 *******************************************************************************-->
<!DOCTYPE html>
<html xmlns:ng="http://angularjs.org" id="ng-app">
<head>
    <script type="text/javascript">
        var pageControllers = {};
    </script>
<head>
 <g:applyLayout name="bannerWebPage">
    <base href="${createLink(uri: '/ssb')}/">
    <meta name="headerAttributes" content=""/>
    <title></title>
    <meta name="menuEndPoint" content="${g.createLink(controller: 'selfServiceMenu', action: 'data')}"/>
    <meta name="menuBaseURL" content="${createLink(uri: '/ssb')}" />
    <g:set var="applicationContextRoot" value="${application.contextPath}"/>
    <meta name="applicationContextRoot" content="${applicationContextRoot}">

    <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
        <asset:stylesheet href="modules/aipAppRTL-mf.css"/>
    </g:if>
    <g:else>
        <asset:stylesheet href="modules/aipApp-mf.css"/>
    </g:else>
    <asset:javascript src="modules/aipReviewApp-mf.js"/>
 </g:applyLayout>
    <script type="text/javascript">

        // Track calling page for breadcrumbs
        (function () {
            // URLs to exclude from updating genAppCallingPage, because they're actually either the authentication
            // page or App Nav, and are not "calling pages."
            var referrerUrl = document.referrer,
                excludedRegex = [
                    /\${applicationContextRoot}\/login\/auth?/,
                    /\${applicationContextRoot}\//,
                    /\/seamless/
                ],
                isExcluded;

            if (referrerUrl) {
                isExcluded = _.find(excludedRegex, function (regex) {
                    return regex.test(referrerUrl);
                });

                if (!isExcluded) {
                    // Track this page
                    sessionStorage.setItem('genAIPAppCallingPage', referrerUrl);
                }
            }
        })();
    </script>
    <script type="text/javascript">
        <g:aipVersion/>
        <g:if env="development">
        window.aip?window.aip.dev="development":window.aip={dev:"development"};
        </g:if>
        if ("${fragment}") {
            window.location.href = "${fragment}";
        }
    </script>
    <script type="text/javascript">
        <g:i18n_setup/>
    </script>

</head>

<body>
<div id="content" role="main" ng-app="bannerAIPReview">
    <div class="progressbar-container ng-cloak" ng-controller="SpinnerCtrl" ng-show="vm.showing">
        <uib-progressbar aria-labelledby="progressbar" class="progress-striped active" value="100" type="info">
            <span id="progressbar">{{'aip.common.text.loading'|i18n_aip}}</span>
        </uib-progressbar>
    </div>
    <div id="title-panel" class="aurora-theme"></div>
    <div class="viewContainer container-fluid">
        <div ui-view></div>
    </div>
</div>
</body>
</html>
