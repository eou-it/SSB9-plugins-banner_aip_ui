///<reference path = "../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var CsrBreadcrumbService = (function () {
        function CsrBreadcrumbService($location) {
            this.$inject = ["$location"];
            this.$location = $location;
            this.init();
        }
        CsrBreadcrumbService.prototype.init = function () {
            this.breadcrumbs = {};
        };
        CsrBreadcrumbService.prototype.updateBreadcrumb = function (item) {
            var _this = this;
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = Object.keys(item)[0];
            if (existItemTitle.indexOf(itemTitle) === -1) {
                item[itemTitle] = item[itemTitle].indexOf("/csr#/admin") === -1 ? "/csr#/admin".concat(item[itemTitle]) : item[itemTitle];
                this.breadcrumbs[itemTitle] = item[itemTitle];
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
            var allPageTitle = Object.keys(this.breadcrumbs);
            var updatedHeaderAttributes = {
                "pageTitle": title,
                "breadcrumb": this.breadcrumbs
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        };
        return CsrBreadcrumbService;
    })();
    CSR.CsrBreadcrumbService = CsrBreadcrumbService;
})(CSR || (CSR = {}));
angular.module("bannercsr").service("CsrBreadcrumbService", CSR.CsrBreadcrumbService);
//# sourceMappingURL=csrBreadcrumbService.js.map