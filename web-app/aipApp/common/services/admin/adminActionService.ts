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
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var params = {
                filterName: query.searchString||"%",
                sortColumn: query.sortColumnName||"id",
                sortDirection: query.ascending||false,
                max: realMax||"",
                offset: query.offset || 0
            };
            this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.actionItemList,
                data: params
            }).then((response:any)=> {
                var header = [{
                    name: "actionItemId",
                    title: "id",
                    options: {
                        sortable: true,
                        visible: false,
                        width: 0
                    }
                }, {
                    name: "actionItemName",
                    title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                    options: {
                        sortable: true,
                        visible: true,
                        width: 0
                    }
                }, {
                    name: "folderName",
                    title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                    options: {
                        sortable: true,
                        visible: true,
                        width: 0
                    }
                }, {
                    name: "actionItemStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    options: {
                        sortable: true,
                        visible: true,
                        width: 0
                    }
                }, {
                    name: "actionItemUserId",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    options: {
                        sortable: true,
                        visible: true,
                        width: 0
                    }
                }, {
                    name: "actionItemActivityDate",
                    title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                    options: {
                        sortable: true,
                        visible: true,
                        width: 0
                    }
                }];
                var result = {header:header, result:response.data.result, length: response.data.length};
                deferred.resolve(result);
            }, (data) => {
                deferred.reject(data);
            })
            // this.$http.get(url)
            //     .success((data:any) => {
            //         //Action Item Title, Folder, Status, Last Update By, Activity Date
            //         var header = [{
            //             name: "actionItemId",
            //             title: "id",
            //             options: {
            //                 sortable: true,
            //                 visible: false,
            //             }
            //         }, {
            //             name: "actionItemName",
            //             title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
            //             options: {
            //                 sortable: true,
            //                 visible: true
            //             }
            //         }, {
            //             name: "folderName",
            //             title: this.$filter("i18n_aip")("aip.list.grid.folder"),
            //             options: {
            //                 sortable: true,
            //                 visible: true
            //             }
            //         }, {
            //             name: "actionItemStatus",
            //             title: this.$filter("i18n_aip")("aip.list.grid.status"),
            //             options: {
            //                 isSortable: true,
            //                 visible: true
            //             }
            //         }, {
            //             name: "actionItemUserId",
            //             title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
            //             options: {
            //                 sortable: true,
            //                 visible: true
            //             }
            //         }, {
            //             name: "actionItemActivityDate",
            //             title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
            //             options: {
            //                 sortable: true,
            //                 visible: true
            //             }
            //         }];
            //         var result = {header:header, result:data, length: data.length};
            //         deferred.resolve(result);
            //     })
            //     .error((data) => {
            //         deferred.reject(data);
            //     });
            return deferred.promise;
        };
    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);