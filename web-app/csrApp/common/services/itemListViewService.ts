///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {

    export class ItemListViewService  {
        static $inject=["$http", "$q"];
        $http: ng.IHttpService;
        $q:ng.IQService;
        userItems;
        constructor($http:ng.IHttpService, $q:ng.IQService) {
            this.$http = $http;
            this.$q = $q;
            this.userItems = {};
            this.init();
        }
        init() {
            this.getActionItems();
        }

        getActionItems() {
            this.$http({
                method:"POST",
                url: "csrTest/actionItems"
            })
            .then((response) => {
                this.userItems = response.data;
            }, (errorResponse) => {
                console.log(errorResponse);
            });;
            return this.userItems;
        }
        confirmItem(id) {
            //TODO: update datbase
            angular.forEach(this.userItems, (item) => {
                angular.forEach(item.items, (_item) => {
                    if(_item.id == id) {
                        _item.state = "csr.user.list.item.state.complete";
                    }
                });
            });
        }
    }
}

register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);