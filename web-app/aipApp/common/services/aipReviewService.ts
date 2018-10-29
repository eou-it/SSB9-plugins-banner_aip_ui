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
        getActionItemList();
    }

    export class AIPReviewService implements IAIPReviewService{
        static $inject=["$http", "$q","ENDPOINT", "APP_PATH"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        APP_PATH;
        ENDPOINT;
        constructor($http:ng.IHttpService, $q:ng.IQService,ENDPOINT, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
            this.ENDPOINT=ENDPOINT;
        }
        getActionItemList() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.review.listActionItemNames
            })
            return request;
        }
    }
}
register("bannerCommonAIP").service("AIPReviewService", AIP.AIPReviewService);
