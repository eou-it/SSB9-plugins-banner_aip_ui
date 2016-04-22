///<reference path = "../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var CsrBreadcrumbService = (function () {
        function CsrBreadcrumbService($location, $filter) {
            this.$inject = ["$location", "$filter"];
            this.$location = $location;
            this.$filter = $filter;
            this.breadcrumbs = {};
        }
        CsrBreadcrumbService.prototype.updateBreadcrumb = function (item) {
            var _this = this;
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = this.$filter('i18n_csr')(item.title);
            if (existItemTitle.indexOf(itemTitle) === -1) {
                //var applicationPath = window.location.href.split("#")[0];
                item.url = window.location.href.indexOf("aip") !== -1 ? "/aip".concat(item.url) : item.url;
                //item.url = Application.getApplicationPath().indexOf("csr#")===-1 ? "/csr#".concat(item.url) : item.url;
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
        CsrBreadcrumbService.prototype.draw = function (title) {
            var updatedHeaderAttributes = {
                "pageTitle": this.$filter('i18n_csr')(title),
                "breadcrumb": this.breadcrumbs
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        };
        CsrBreadcrumbService.prototype.removeLastUrl = function () {
        };
        return CsrBreadcrumbService;
    })();
    CSR.CsrBreadcrumbService = CsrBreadcrumbService;
})(CSR || (CSR = {}));
angular.module("bannercsr").service("CsrBreadcrumbService", CSR.CsrBreadcrumbService);
//# sourceMappingURL=csrBreadcrumbService.js.map