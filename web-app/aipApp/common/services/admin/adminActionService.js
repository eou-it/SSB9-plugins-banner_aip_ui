/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminActionService = (function () {
        function AdminActionService($http, $q, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.ENDPOINT = ENDPOINT;
        }
        AdminActionService.prototype.getActionLists = function () {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.actionList
            });
            return request;
        };
        AdminActionService.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.actionItemList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || '') +
                '&ascending=' + query.ascending +
                '&offset=' + (query.offset || '') +
                '&max=' + (query.max || '');
            this.$http.get(url)
                .success(function (data) {
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
                var result = { header: header, result: data, length: data.length };
                deferred.resolve(result);
            })
                .error(function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        ;
        AdminActionService.$inject = ["$http", "$q", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
//# sourceMappingURL=adminActionService.js.map