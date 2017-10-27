///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var PostActionListPageCtrl = (function () {
        function PostActionListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminActionService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
                "AdminActionService"];
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.actionListService = AdminActionService;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
        }
        PostActionListPageCtrl.prototype.init = function () {
            this.gridData = {};
            this.draggableColumnNames = [];
            this.mobileConfig = {
                jobStatus: 3,
                jobName: 3,
                scheduleDate: 3,
                groupFolder: 3,
                population: 3,
                group: 3,
                submittedBy: 3,
                action: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "actionItemDataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.actionItem"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                    name: "actionItemId",
                    title: "id",
                    width: "0px",
                    options: {
                        sortable: true,
                        visible: false,
                        columnShowHide: false
                    }
                }, {
                    name: "jobStatus",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.status"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        ascending: true,
                        columnShowHide: false
                    }
                }, {
                    name: "jobName",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.name"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
                    }
                },
                {
                    name: "scheduleDate",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.start-schedule.date"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupFolder",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.folder"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.folder"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "population",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.population"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.population"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "group",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.name"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.name"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "submittedBy",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.submittedBy"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.submittedBy"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "action",
                    title: this.$filter("i18n_aip")("aip.action.item.list.grid.action"),
                    ariaLabel: this.$filter("i18n_aip")("aip.action.item.list.grid.action"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }];
        };
        PostActionListPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".actionListContainer .control").height() -
                30;
            return { height: containerHeight };
        };
        PostActionListPageCtrl.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            this.actionListService.fetchData(query)
                .then(function (response) {
                // this.gridData = response;
                // this.gridData.header = this.header;
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        PostActionListPageCtrl.prototype.selectRecord = function (data) {
            this.selectedRecord = data;
            // this.actionListService.enableActionItemOpen(data.id);
            // this.$state.params.actionid = data.id;
        };
        PostActionListPageCtrl.prototype.refreshGrid = function () {
        };
        PostActionListPageCtrl.prototype.goAddPage = function () {
            this.$state.go("admin-post-add");
        };
        // goOpenPage() {
        //
        // }
        PostActionListPageCtrl.prototype.openActionItem = function () {
            this.$state.go("admin-action-open", { data: this.selectedRecord.id });
        };
        return PostActionListPageCtrl;
    }());
    AIP.PostActionListPageCtrl = PostActionListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("PostActionListPageCtrl", AIP.PostActionListPageCtrl);
