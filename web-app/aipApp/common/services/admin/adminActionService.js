/**
 * Created by jshin on 8/10/16.
 */
///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminActionService = (function () {
        function AdminActionService($http, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
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
            var _this = this;
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
                        title: _this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "folderName",
                        title: _this.$filter("i18n_aip")("aip.list.grid.folder"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "status",
                        title: _this.$filter("i18n_aip")("aip.list.grid.status"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "userId",
                        title: _this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                        options: {
                            isSortable: true,
                            visible: true
                        }
                    }, {
                        name: "activityDate",
                        title: _this.$filter("i18n_aip")("aip.list.grid.activityDate"),
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
        AdminActionService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
//# sourceMappingURL=adminActionService.js.map