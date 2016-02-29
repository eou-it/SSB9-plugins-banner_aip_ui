<%--
  Created by IntelliJ IDEA.
  User: jshin
  Date: 1/13/16
  Time: 4:31 PM
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="headerAttributes" content=""/>
    <title></title>
    <meta name="layout" content="bannerSelfServicePage"/>
    <r:require modules="bannerCSRUI"/>
    <g:if test="${message(code: 'default.language.direction')  == 'rtl'}">
        <r:require modules="bannerCSRUIRTL"/>
    </g:if>
    <meta name="menuEndPoint" content="${g.createLink(controller: 'selfServiceMenu', action: 'data')}"/>
    <meta name="menuBaseURL" content="${createLink(uri: '/ssb')}" />
    <script type="text/javascript">
        console.log("run i18n setup");
        <g:i18n_setup/>
        console.log("setup done");
        console.log(window.i18n["csr.default"]);
        console.log(window.i18n["csr-ui.default"]);
    </script>
</head>

<body>
<div id="content" role="main" ng-app="bannercsr">
    <div class="progressbar-container ng-cloak" ng-controller="SpinnerCtrl" ng-show="vm.showing">
        <uib-progressbar class="progress-striped active" value="100" type="info">Loading</uib-progressbar>
    </div>
    <div id="title-panel" class="aurora-theme"></div>
    <div class="viewContainer container-fluid">
        <div ui-view></div>
    </div>
</div>
</body>
</html>