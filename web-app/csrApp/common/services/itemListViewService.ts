///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {

    export class ItemListViewService  {
        static $inject=["$http", "$q"];
        $http: ng.IHttpService;
        $q:ng.IQService;
        constructor($http:ng.IHttpService, $q:ng.IQService) {
            this.$http = $http;
            this.$q = $q;
        }

        getActionItems() {
            var request = this.$http({
                method:"POST",
                url: "csr/actionItems"
            });
            return request;
        }
    }
}

register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);