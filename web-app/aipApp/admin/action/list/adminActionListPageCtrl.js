///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionListPageCtrl = (function () {
        function AdminActionListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminActionService) {
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
        AdminActionListPageCtrl.prototype.init = function () {
            this.gridData = {};
            this.draggableColumnNames = [];
            this.mobileConfig = {
                actionItemName: 3,
                folderName: 3,
                actionItemStatus: 3,
                actionItemUserId: 3,
                actionItemActivityDate: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "actionItemDataTableSearch",
                delay: 300,
                ariaLabel: "Search for any action Items",
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
                    name: "actionItemName",
                    title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
                        columnShowHide: false
                    }
                }, {
                    name: "folderName",
                    title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.folder"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: false
                    }
                }, {
                    name: "actionItemStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "actionItemUserId",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "actionItemActivityDate",
                    title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }];
        };
        AdminActionListPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".actionListContainer .control").height() -
                30;
            return { height: containerHeight };
        };
        AdminActionListPageCtrl.prototype.fetchData = function (query) {
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
        AdminActionListPageCtrl.prototype.selectRecord = function (data) {
            this.selectedRecord = data;
            this.actionListService.enableActionItemOpen(data.id);
            this.$state.params.actionid = data.id;
        };
        AdminActionListPageCtrl.prototype.refreshGrid = function () {
        };
        AdminActionListPageCtrl.prototype.goAddPage = function () {
            this.$state.go("admin-action-add");
        };
        AdminActionListPageCtrl.prototype.goOpenPage = function () {
            this.$state.go("admin-action-open", { data: this.$state.params.actionid });
        };
        return AdminActionListPageCtrl;
    }());
    AIP.AdminActionListPageCtrl = AdminActionListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionListPageCtrl", AIP.AdminActionListPageCtrl);
//# sourceMappingURL=adminActionListPageCtrl.js.map