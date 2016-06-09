<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="headerAttributes" content=""/>
    <title></title>
    <meta name="layout" content="bannerSelfServicePage"/>
    <r:require modules="bannerAIPUI"/>
    <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
        <r:require modules="bannerAIPUIRTL"/>
    </g:if>
    <meta name="menuEndPoint" content="${g.createLink(controller: 'selfServiceMenu', action: 'data')}"/>
    <meta name="menuBaseURL" content="${createLink(uri: '/ssb')}" />
    <ckeditor:resources/>
    <script type="text/javascript">
        <g:i18n_setup/>
        <g:aipVersion/>
        <g:if env="development">
            window.aip?window.aip.dev="development":window.aip={dev:"development"};
        </g:if>
        <g:javascript>
        if ("${fragment}") {
            window.location.href = "#${fragment}";
        }
        </g:javascript>
    </script>
</head>

<body>
<div id="content" role="main" ng-app="bannerAIP">
    <div class="progressbar-container ng-cloak" ng-controller="SpinnerCtrl" ng-show="vm.showing">
        <uib-progressbar aria-labelledby="progressbar" class="progress-striped active" value="100" type="info">
            <span id="progressbar">Loading</span>
        </uib-progressbar>
    </div>
    <div id="title-panel" class="aurora-theme"></div>
    <div class="viewContainer container-fluid">
        <div ui-view></div>
    </div>
</div>
</body>
</html>