///<reference path = "../../../typings/tsd.d.ts"/>

declare var BreadCrumbAndPageTitle;

module AIP {
    interface IBreadcrumbItem {
        url: string;
        title: string;
    }
    interface IAIPBreadcrumbService {
        breadcrumbs: {};
        updateBreadcrumb(item:IBreadcrumbItem): void;
        draw(title: string): void
    }

    export class AIPBreadcrumbService implements IAIPBreadcrumbService{
        $inject = ["$location", "$filter"];
        breadcrumbs: {};
        $location;
        $filter
        constructor($location, $filter) {
            this.$location = $location;
            this.$filter = $filter;
            this.breadcrumbs = {};
        }
        updateBreadcrumb(item: IBreadcrumbItem) {
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = this.$filter('i18n_aip')(item.title);
            if(existItemTitle.indexOf(itemTitle)===-1) {
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
                "pageTitle": this.$filter('i18n_aip')(title),
                "breadcrumb":this.breadcrumbs
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        }
        removeLastUrl() {

        }
    }
}

angular.module("bannerAIP").service("BreadcrumbService", AIP.AIPBreadcrumbService);