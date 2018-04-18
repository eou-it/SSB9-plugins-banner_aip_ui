/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
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
        updateBreadcrumb(item: IBreadcrumbItem): void;
        draw(title: string): void;
        drawAll(): void;
        init(): void;
    }

    export class AIPBreadcrumbService implements IAIPBreadcrumbService {
        $inject = ["$location", "$filter"];
        breadcrumbs: {};
        $location;
        $filter;
        callingUrl: any;

        constructor($location, $filter) {
            this.$location = $location;
            this.$filter = $filter;
            this.breadcrumbs = {};
            this.callingUrl = sessionStorage.getItem('genAppCallingPage');
            this.init();
        }

        init() {
            if (this.callingUrl) {
                this.breadcrumbs = JSON.parse(this.callingUrl);
            }
        }

        updateBreadcrumb(item: IBreadcrumbItem) {
            var existItemTitle = Object.keys(this.breadcrumbs);
            if (existItemTitle.indexOf(item.title) === -1) {
                if (this.checkSkip(existItemTitle[existItemTitle.length - 1], item.title)) {
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
            sessionStorage.setItem('genAppCallingPage', JSON.stringify(this.breadcrumbs));
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
                if (Object.keys(this.breadcrumbs).indexOf(key) === Object.keys(this.breadcrumbs).length - 1) {
                    breadcrumbI18[this.$filter('i18n_aip')(key)] = "";
                } else {
                    breadcrumbI18[this.$filter('i18n_aip')(key)] = value;
                }
            }, this.breadcrumbs);


            var updatedHeaderAttributes = {
                "pageTitle": this.$filter('i18n_aip')(title),
                "breadcrumb": breadcrumbI18
            };
            BreadCrumbAndPageTitle.draw(updatedHeaderAttributes);
        }

        drawAll() {
            angular.forEach(this.breadcrumbs, (value, key) => {
                this.draw(key);
            });
        }
    }
}

angular.module("bannerAIP").service("BreadcrumbService", AIP.AIPBreadcrumbService);
