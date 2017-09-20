/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
        $filter;
        constructor($location, $filter) {
            this.$location = $location;
            this.$filter = $filter;
            this.breadcrumbs = {};
        }
        updateBreadcrumb(item: IBreadcrumbItem) {
            var existItemTitle = Object.keys(this.breadcrumbs);
            var itemTitle = this.$filter('i18n_aip')(item.title);
            if(existItemTitle.indexOf(item.title)===-1) {
                if(this.checkSkip(existItemTitle[existItemTitle.length-1], item.title)) {
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
        checkSkip(newVal, oldVal) {
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
        }
        draw(title: string) {
            var breadcrumbI18 = {};
            angular.forEach(this.breadcrumbs, (value, key) => {
                if(Object.keys(this.breadcrumbs).indexOf(key)===Object.keys(this.breadcrumbs).length-1) {
                    breadcrumbI18[this.$filter('i18n_aip')(key)] = "";
                } else {
                    breadcrumbI18[this.$filter('i18n_aip')(key)] = value;
                }
            }, this.breadcrumbs);


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