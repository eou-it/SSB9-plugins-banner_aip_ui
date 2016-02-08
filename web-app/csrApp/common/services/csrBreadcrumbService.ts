///<reference path = "../../../typings/tsd.d.ts"/>

declare var BreadCrumbAndPageTitle;
declare var Application;

module CSR {
    export class CsrBreadcrumbService {
        $inject = ["$location"];
        breadcrumbs: {};
        $location;
        constructor($location) {
            this.$location = $location;
            this.init();
        }
        init() {
            this.breadcrumbs = {};
        }
        updateBreadcrumb(item) {
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = Object.keys(item)[0];

            if(existItemTitle.indexOf(itemTitle)===-1) {
                item[itemTitle] = Application.getApplicationPath().indexOf("csr#")===-1 ? "/csr#/".concat(item[itemTitle]) : item[itemTitle];
                this.breadcrumbs[itemTitle] = item[itemTitle];
            } else {
                var temp = {};
                existItemTitle = existItemTitle.slice(0, existItemTitle.indexOf(itemTitle) + 1);
                angular.forEach(existItemTitle, (item) => {
                    temp[item] = this.breadcrumbs[item];
                });
                this.breadcrumbs = temp;
            }
            this.draw(item.title);
        }
        draw(title) {
            var allPageTitle = Object.keys(this.breadcrumbs);
            var updatedHeaderAttributes = {
                "pageTitle": title,
                "breadcrumb":this.breadcrumbs
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        }
    }
}

angular.module("bannercsr").service("CsrBreadcrumbService", CSR.CsrBreadcrumbService);