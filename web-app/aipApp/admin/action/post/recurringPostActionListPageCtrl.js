/*******************************************************************************
 Copyright 2019 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var RecurringPostActionListPageCtrl = /** @class */ (function () {
        function RecurringPostActionListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminActionService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
                "AdminActionService"];
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.actionListService = AdminActionService;
            this.localeTime = {};
            this.timezones = {};
            this.recurringPostJobsMetaData = {};
            this.init();
            angular.element($window).bind('resize', function () {
                $scope.$apply();
            });
        }
        RecurringPostActionListPageCtrl.prototype.init = function () {
            var _this = this;
            this.fetchRecurringMetaData();
            this.gridHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".actionListContainer .control").height() -
                30;
            this.gridData = {};
            var allPromises = [];
            this.draggableColumnNames = [];
            this.mobileConfig = {
                jobState: 3,
                postingName: 3,
                postingDisplayStartDate: 3,
                groupFolderName: 3,
                postingPopulation: 3,
                groupName: 3,
                postingCreatorId: 3,
                action: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "dataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.actionItemPostJob"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                    name: "postingId",
                    title: "id",
                    width: "0px",
                    options: {
                        sortable: false,
                        visible: false,
                        ascending: true,
                        columnShowHide: false
                    }
                }, {
                    name: "lastModified",
                    title: "modifiedOn",
                    width: "0px",
                    options: {
                        sortable: true,
                        visible: false,
                        ascending: false,
                        columnShowHide: false
                    }
                }, {
                    name: "jobState",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                    width: "125px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
                    }
                }, {
                    name: "postingName",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: false
                    }
                },
                {
                    name: "postingDisplayDateTime",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "postingDisplayTime",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.time"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.time"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "postingTimeZone",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.timezone"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.timezone"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "displayStartDate",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayStartDate"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayStartDate"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "displayEndDate",
                    title: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayEndDate"),
                    ariaLabel: this.$filter("i18n_aip")("js.aip.review.monitor.action.item.grid.header.displayEndDate"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }
            ];
            allPromises.push(this.actionListService.getCurrentTimeLocale()
                .then(function (response) {
                _this.localeTime = response.data.use12HourClock;
            }));
            allPromises.push(this.actionListService.getCurrentTimeZoneLocale()
                .then(function (response) {
                var that = _this;
                _this.timezones = response.data.timezones;
            }));
        };
        RecurringPostActionListPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".actionListContainer .control").height() -
                30;
            return { height: containerHeight };
        };
        RecurringPostActionListPageCtrl.prototype.fetchTableData = function (query) {
            var deferred = this.$q.defer();
            var am = this.$filter("i18n_aip")("aip.admin.communication.timepicker.time.am.label");
            var pm = this.$filter("i18n_aip")("aip.admin.communication.timepicker.time.pm.label");
            query.recurringPostId = this.$state.params.postIdval;
            this.actionListService.fetchTableData(query)
                .then(function (response) {
                for (var k = 0; k < response.result.length; k++) {
                    if (response.result[k].postingDisplayTime) {
                        response.result[k].postingDisplayTime = response.result[k].postingDisplayTime.replace(new RegExp('AM', 'i'), am)
                            .replace(new RegExp('PM', 'i'), pm)
                            .replace(new RegExp('a. m.', 'i'), am)
                            .replace(new RegExp('p. m.', 'i'), pm)
                            .replace(new RegExp('a.m.', 'i'), am)
                            .replace(new RegExp('p.m.', 'i'), pm);
                    }
                }
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        RecurringPostActionListPageCtrl.prototype.fetchRecurringMetaData = function () {
            var _this = this;
            this.actionListService.fetchRecurringJobPostMetaData(this.$state.params.postIdval)
                .then(function (response) {
                _this.recurringPostJobsMetaData = response;
            }, function (error) {
                console.log(error);
            });
        };
        return RecurringPostActionListPageCtrl;
    }());
    AIP.RecurringPostActionListPageCtrl = RecurringPostActionListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("RecurringPostActionListPageCtrl", AIP.RecurringPostActionListPageCtrl);
//# sourceMappingURL=recurringPostActionListPageCtrl.js.map