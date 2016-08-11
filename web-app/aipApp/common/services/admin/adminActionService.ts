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
        fetchData (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || '') +
                '&ascending=' + query.ascending +
                '&offset=' + (query.offset || '') +
                '&max=' + (query.max || '');
            this.$http.get(url)
                .success(function(data:any) {
                    //Action Item Title, Folder, Status, Last Update By, Activity Date
                    var header = [{
                        name: "id",
                        title: "id",
                        options: {
                            isSortable: true,
                            visible: false
                        }
                    }, {
                        name: "name",
                        title: "Action Item Title",
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "folderName",
                        title: "Folder",
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "status",
                        title: "Status",
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "userId",
                        title: "Last Updated By",
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "activityDate",
                        title: "Activity Date",
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }];
                    var result = {header:header, result:data, length: data.length};
                    deferred.resolve(result);
                })
                .error(function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }
}

register("bannerAIP").service("AdminActionService", AIP.AdminActionService);