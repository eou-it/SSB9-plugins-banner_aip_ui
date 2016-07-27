///<reference path = "../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AIPBreadcrumbService = (function () {
        function AIPBreadcrumbService($location, $filter) {
            this.$inject = ["$location", "$filter"];
            this.$location = $location;
            this.$filter = $filter;
            this.breadcrumbs = {};
        }
        AIPBreadcrumbService.prototype.updateBreadcrumb = function (item) {
            var _this = this;
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = this.$filter('i18n_aip')(item.title);
            if (existItemTitle.indexOf(item.title) === -1) {
                if (existItemTitle[existItemTitle.length - 1] === 'aip.admin.group.add' && item.title === 'aip.admin.group.open') {
                    delete this.breadcrumbs['aip.admin.group.add'];
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
        };
        AIPBreadcrumbService.prototype.draw = function (title) {
            var _this = this;
            var breadcrumbI18 = {};
            angular.forEach(this.breadcrumbs, function (value, key) {
                breadcrumbI18[_this.$filter('i18n_aip')(key)] = value;
            });
            var updatedHeaderAttributes = {
                "pageTitle": this.$filter('i18n_aip')(title),
                "breadcrumb": breadcrumbI18
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        };
        AIPBreadcrumbService.prototype.removeLastUrl = function () {
        };
        return AIPBreadcrumbService;
    })();
    AIP.AIPBreadcrumbService = AIPBreadcrumbService;
})(AIP || (AIP = {}));
angular.module("bannerAIP").service("BreadcrumbService", AIP.AIPBreadcrumbService);
//# sourceMappingURL=breadcrumbService.js.map