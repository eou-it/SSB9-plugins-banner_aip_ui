/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module AIP {

    interface IAdminActionService {

    }

    export class AdminActionService implements IAdminActionService{
        static $inject=["$http", "$q", "ENDPOINT"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        ENDPOINT;
        constructor($http:ng.IHttpService, $q, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.ENDPOINT = ENDPOINT;
        }
        getActionLists() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionList
            });
            return request;
        }

    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);