///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminActionListPageCtrl = (function () {
        function AdminActionListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, SEARCHCONFIG, AdminActionService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG", "SEARCHCONFIG",
                "AdminActionService"];
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.searchConfig = SEARCHCONFIG;
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
                    options: {
                        sortable: true,
                        visible: false,
                        columnShowHide: false,
                        width: 0
                    }
                }, {
                    name: "actionItemName",
                    title: this.$filter("i18n_aip")("aip.list.grid.itemTitle"),
                    ariaLabel: "Action Item Title",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
                        columnShowHide: false,
                        width: 0
                    }
                }, {
                    name: "folderName",
                    title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                    ariaLabel: "Folder Name",
                    options: {
                        sortable: true,
                        visible: true,
                        width: 0
                    }
                }, {
                    name: "actionItemStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    ariaLabel: "Status",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true,
                        width: 0
                    }
                }, {
                    name: "actionItemUserId",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    ariaLabel: "Last Updated By",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true,
                        width: 0
                    }
                }, {
                    name: "actionItemActivityDate",
                    title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                    ariaLabel: "Activity Date",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true,
                        width: 0
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
            var _this = this;
            var deferred = this.$q.defer();
            this.actionListService.fetchData(query)
                .then(function (response) {
                _this.gridData = response;
                _this.gridData.header = _this.header;
                deferred.resolve(_this.gridData);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        AdminActionListPageCtrl.prototype.selectRecord = function (data) {
        };
        AdminActionListPageCtrl.prototype.refreshGrid = function () {
        };
        return AdminActionListPageCtrl;
    }());
    AIP.AdminActionListPageCtrl = AdminActionListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionListPageCtrl", AIP.AdminActionListPageCtrl);
//# sourceMappingURL=adminActionListPageCtrl.js.map