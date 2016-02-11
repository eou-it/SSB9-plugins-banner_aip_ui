///<reference path = "../../../typings/tsd.d.ts"/>

declare var BreadCrumbAndPageTitle;

module CSR {
    interface IBreadcrumbItem {
        url: string;
        title: string;
    }
    interface ICsrBreadcrumbService {
        breadcrumbs: {};
        updateBreadcrumb(item:IBreadcrumbItem): void;
        draw(title: string): void
    }

    export class CsrBreadcrumbService implements ICsrBreadcrumbService{
        $inject = ["$location"];
        breadcrumbs: {};
        $location;
        constructor($location) {
            this.$location = $location;
            this.breadcrumbs = {};
        }
        updateBreadcrumb(item: IBreadcrumbItem) {
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = item.title;
            if(existItemTitle.indexOf(itemTitle)===-1) {
                //var applicationPath = window.location.href.split("#")[0];
                item.url = window.location.href.indexOf("csr#") !==-1 ? "/csr#".concat(item.url) : item.url;
                //item.url = Application.getApplicationPath().indexOf("csr#")===-1 ? "/csr#".concat(item.url) : item.url;
                this.breadcrumbs[itemTitle] = item.url
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
        draw(title: string) {
            var updatedHeaderAttributes = {
                "pageTitle": title,
                "breadcrumb":this.breadcrumbs
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        }
    }
}

angular.module("bannercsr").service("CsrBreadcrumbService", CSR.CsrBreadcrumbService);