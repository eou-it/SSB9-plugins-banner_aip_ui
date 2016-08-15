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
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var params = {
                filterName: query.searchString || "%",
                sortColumn: query.sortColumnName || "id",
                sortAscending: query.ascending || false,
                max: realMax || "",
                offset: query.offset || 0
            };
            this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.actionItemList,
                data: params
            }).then(function (response) {
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
                        title: _this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                        options: {
                            sortable: true,
                            visible: true,
                            width: 0
                        }
                    }, {
                        name: "folderName",
                        title: _this.$filter("i18n_aip")("aip.list.grid.folder"),
                        options: {
                            sortable: true,
                            visible: true,
                            width: 0
                        }
                    }, {
                        name: "actionItemStatus",
                        title: _this.$filter("i18n_aip")("aip.list.grid.status"),
                        options: {
                            sortable: true,
                            visible: true,
                            width: 0
                        }
                    }, {
                        name: "actionItemUserId",
                        title: _this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                        options: {
                            sortable: true,
                            visible: true,
                            width: 0
                        }
                    }, {
                        name: "actionItemActivityDate",
                        title: _this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                        options: {
                            sortable: true,
                            visible: true,
                            width: 0
                        }
                    }];
                var result = { header: header, result: response.data.result, length: response.data.length };
                deferred.resolve(result);
            }, function (data) {
                deferred.reject(data);
            });
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
        ;
        AdminActionService.$inject = ["$http", "$q", "$filter", "ENDPOINT"];
        return AdminActionService;
    }());
    AIP.AdminActionService = AdminActionService;
})(AIP || (AIP = {}));
register("bannerAIP").service("AdminActionService", AIP.AdminActionService);
//# sourceMappingURL=adminActionService.js.map