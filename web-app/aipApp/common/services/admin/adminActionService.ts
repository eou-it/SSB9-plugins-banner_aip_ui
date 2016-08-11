/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module AIP {

    interface IAdminActionService {

    }

    export class AdminActionService implements IAdminActionService{
        static $inject=["$http", "$q", "$filter", "ENDPOINT"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        $filter;
        ENDPOINT;
        constructor($http:ng.IHttpService, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
            this.ENDPOINT = ENDPOINT;
        }
        getActionLists() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionList
            });
            return request;
        }
        fetchData (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || '') +
                '&ascending=' + query.ascending +
                '&offset=' + (query.offset || '') +
                '&max=' + (query.max || '');
            this.$http.get(url)
                .success((data:any) => {
                    //Action Item Title, Folder, Status, Last Update By, Activity Date
                    var header = [{
                        name: "actionItemId",
                        title: "id",
                        options: {
                            isSortable: true,
                            visible: false
                        }
                    }, {
                        name: "actionItemName",
                        title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "folderName",
                        title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "actionItemStatus",
                        title: this.$filter("i18n_aip")("aip.list.grid.status"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "actionItemUserId",
                        title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "actionItemActivityDate",
                        title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }];
                    var result = {header:header, result:data, length: data.length};
                    deferred.resolve(result);
                })
                .error((data) => {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);