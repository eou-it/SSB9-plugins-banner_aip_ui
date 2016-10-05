//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var AdminStatusListPageCtrl = (function () {
        function AdminStatusListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminActionStatusService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
                "AdminActionStatusService"];
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.adminActionStatusService = AdminActionStatusService;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
            /*
             $scope.$watch("[vm.groupDetailResponse, vm.groupInfo]" , (newVal, oldVal) => {
             if(!$scope.$$phase) {
             $scope.apply();
             }
             });*/
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
        }
        AdminStatusListPageCtrl.prototype.init = function () {
            this.gridData = {};
            this.draggableColumnNames = [];
            this.mobileConfig = {
                actionItemStatus: 3,
                actionItemBlockedProcess: 3,
                actionItemSystemRequired: 3,
                actionItemActive: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "groupDataTableSearch",
                delay: 300,
                //todo:change this out for message property
                ariaLabel: "Search for any action Items",
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                    name: "actionItemStatusId",
                    title: "id",
                    width: "0px",
                    options: {
                        sortable: true,
                        visible: false,
                        columnShowHide: false
                    }
                }, {
                    name: "actionItemStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.groupTitle"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.groupTitle"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
                        columnShowHide: false
                    }
                }, {
                    name: "actionItemStatusBlockedProcess",
                    title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.folder"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: false
                    }
                }, {
                    name: "actionItemStatusSystemRequired",
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "actionItemStatusActive",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "actionItemStatusActivityDate",
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
        AdminStatusListPageCtrl.prototype.add = function () {
            this.$state.go("admin-group-add");
        };
        AdminStatusListPageCtrl.prototype.open = function () {
            var _this = this;
            this.adminActionStatusService.getGroupDetail(this.$state.params.status).then(function (response) {
                if (response.group) {
                    _this.$state.go("admin-group-open", { data: response.group });
                }
                else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminStatusListPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".groupListContainer .control").height() -
                30;
            return { height: containerHeight };
        };
        AdminStatusListPageCtrl.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            this.adminActionStatusService.fetchData(query)
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
        AdminStatusListPageCtrl.prototype.selectRecord = function (data) {
            this.selectedRecord = data;
            this.adminActionStatusService.enableGroupOpen(data.id);
            this.$state.params.grp = data.id;
        };
        AdminStatusListPageCtrl.prototype.refreshGrid = function () {
        };
        return AdminStatusListPageCtrl;
    }());
    AIP.AdminStatusListPageCtrl = AdminStatusListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminStatusListPageCtrl", AIP.AdminStatusListPageCtrl);
//# sourceMappingURL=adminStatusListPageCtrl.js.map