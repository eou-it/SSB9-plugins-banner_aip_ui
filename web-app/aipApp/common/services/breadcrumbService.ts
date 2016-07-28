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
            if(existItemTitle.indexOf(item.title)===-1) {
                if((existItemTitle[existItemTitle.length-1] === 'aip.admin.group.add' && item.title === 'aip.admin.group.open') ||
                    (existItemTitle[existItemTitle.length - 1] === 'aip.admin.group.open' && item.title === 'aip.admin.group.add')){
                    delete this.breadcrumbs[existItemTitle[existItemTitle.length - 1]];
                }
                this.breadcrumbs[item.title] = item.url
            } else {
                var temp = {};
                existItemTitle = existItemTitle.slice(0, existItemTitle.indexOf(item.title) + 1);
                angular.forEach(existItemTitle, (item) => {
                    temp[item] = this.breadcrumbs[item];
                });
                this.breadcrumbs = temp;
            }
            this.draw(item.title);
        }
        draw(title: string) {
            var breadcrumbI18 = {};
            angular.forEach(this.breadcrumbs, (value, key) => {
                breadcrumbI18[this.$filter('i18n_aip')(key)] = value;
            });


            var updatedHeaderAttributes = {
                "pageTitle": this.$filter('i18n_aip')(title),
                "breadcrumb":breadcrumbI18
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        }
        removeLastUrl() {

        }
    }
}

angular.module("bannerAIP").service("BreadcrumbService", AIP.AIPBreadcrumbService);