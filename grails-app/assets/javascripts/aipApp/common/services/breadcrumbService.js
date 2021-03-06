/*******************************************************************************
 Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AIPBreadcrumbService = /** @class */ (function () {
        function AIPBreadcrumbService($location, $filter) {
            this.$location = $location;
            this.$filter = $filter;
            this.breadcrumbs = {};
            this.callingUrl = sessionStorage.getItem('genAIPAppCallingPage');
            this.init();
        }
        AIPBreadcrumbService.prototype.init = function () {
            if (this.callingUrl) {
                this.breadcrumbs = JSON.parse(this.callingUrl);
            }
        };
        AIPBreadcrumbService.prototype.updateBreadcrumb = function (item) {
            var _this = this;
            var existItemTitle = Object.keys(this.breadcrumbs);
            if (existItemTitle.indexOf(item.title) === -1) {
                if (this.checkSkip(existItemTitle[existItemTitle.length - 1], item.title)) {
                    delete this.breadcrumbs[existItemTitle[existItemTitle.length - 1]];
                }
                this.breadcrumbs[item.title] = item.url;
            }
            else {
                var temp = {};
                existItemTitle = existItemTitle.slice(0, existItemTitle.indexOf(item.title) + 1);
                angular.forEach(existItemTitle, function (item) {
                    temp[item] = _this.breadcrumbs[item];
                });
                this.breadcrumbs = temp;
            }
            this.draw(item.title);
            sessionStorage.setItem('genAIPAppCallingPage', JSON.stringify(this.breadcrumbs));
        };
        AIPBreadcrumbService.prototype.checkSkip = function (newVal, oldVal) {
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
        AIPBreadcrumbService.prototype.draw = function (title) {
            var _this = this;
            var breadcrumbI18 = {};
            angular.forEach(this.breadcrumbs, function (value, key) {
                if (Object.keys(_this.breadcrumbs).indexOf(key) === Object.keys(_this.breadcrumbs).length - 1) {
                    breadcrumbI18[_this.$filter('i18n_aip')(key)] = "";
                }
                else {
                    breadcrumbI18[_this.$filter('i18n_aip')(key)] = value;
                }
            }, this.breadcrumbs);
            var updatedHeaderAttributes = {
                "pageTitle": this.$filter('i18n_aip')(title),
                "breadcrumb": breadcrumbI18
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        };
        AIPBreadcrumbService.prototype.drawAll = function () {
            var _this = this;
            angular.forEach(this.breadcrumbs, function (value, key) {
                _this.draw(key);
            });
        };
        AIPBreadcrumbService.$inject = ["$location", "$filter"];
        return AIPBreadcrumbService;
    }());
    AIP.AIPBreadcrumbService = AIPBreadcrumbService;
})(AIP || (AIP = {}));
angular.module("bannerCommonAIP").service("BreadcrumbService", AIP.AIPBreadcrumbService);
