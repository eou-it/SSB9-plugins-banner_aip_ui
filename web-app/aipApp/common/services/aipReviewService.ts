/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module AIP {

    export interface IActionItem {
        description: string;
        id: number|string;
        name: string;
        state: string;
        title: string;
        completedDate: string;
    }

    interface IAIPReviewService {

    }

    export class AIPReviewService implements IAIPReviewService{
        static $inject=["$http", "$q", "APP_PATH"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        APP_PATH;
        constructor($http:ng.IHttpService, $q:ng.IQService, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
        }
    }
}
register("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
