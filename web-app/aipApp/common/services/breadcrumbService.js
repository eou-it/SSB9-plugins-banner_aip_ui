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
            if (existItemTitle.indexOf(itemTitle) === -1) {
                this.breadcrumbs[itemTitle] = item.url;
            }
            else {
                var temp = {};
                existItemTitle = existItemTitle.slice(0, existItemTitle.indexOf(itemTitle) + 1);
                angular.forEach(existItemTitle, function (item) {
                    temp[item] = _this.breadcrumbs[item];
                });
                this.breadcrumbs = temp;
            }
            this.draw(item.title);
        };
        AIPBreadcrumbService.prototype.draw = function (title) {
            var updatedHeaderAttributes = {
                "pageTitle": this.$filter('i18n_aip')(title),
                "breadcrumb": this.breadcrumbs
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        };
        AIPBreadcrumbService.prototype.removeLastUrl = function () {
        };
        return AIPBreadcrumbService;
    })();
    AIP.AIPBreadcrumbService = AIPBreadcrumbService;
})(AIP || (AIP = {}));
angular.module("bannerAIP").service("AIPBreadcrumbService", AIP.AIPBreadcrumbService);
//# sourceMappingURL=breadcrumbService.js.map