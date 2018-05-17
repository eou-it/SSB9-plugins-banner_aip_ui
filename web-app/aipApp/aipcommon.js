/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
// angular module init and configuration
"use strict";

var aipAppRoot = "/" + extensibilityInfo.application + "/plugins/" +
    window.aipApp.fileSystemName + "/aipApp/";
var aipAppAbsPath = window.location.protocol + "//" + window.location.host + Application.getApplicationPath() + "/";
var bcmRoot = window.location.protocol + Application.getApplicationPath();


// required global variables for PageBuilder render
var params = {};
var rootWebApp = aipAppAbsPath.replace("/ssb/", "/");
var resourceBase = rootWebApp + 'internalPb/';

var bannerAIPUI = angular.module("bannerAIPUI", [])
var bannerCommonAIPApp=angular.module("bannerCommonAIP",[
    "ngResource",
    "ngSanitize",
    "ui.router",
    "extensibility",
    "ui.bootstrap",
    "ngAria",
    "ngAnimate",
    "xe-ui-components",
    "bannerAIPUI",
    "ngRoute",
    "SCEAIP",
    "ngCkeditor",
    "BannerOnAngular",
    "I18nAIP",
    "pbrun.directives",
    'dateParser',
    'cm.timepicker'

])

