//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupListPageCtrl = (function () {
        function AdminGroupListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminGroupService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
                "AdminGroupService"];
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.adminGroupService = AdminGroupService;
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
        AdminGroupListPageCtrl.prototype.init = function () {
            this.gridData = {};
            this.draggableColumnNames = [];
            this.mobileConfig = {
                groupTitle: 3,
                folderName: 3,
                groupStatus: 3,
                groupmUserId: 3,
                groupActivityDate: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "groupDataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.group"),
                searchString: "",
                maxlength: 200,
                minimumCharacters: 1
            };
            this.header = [{
                    name: "groupId",
                    title: "id",
                    width: "0px",
                    options: {
                        sortable: true,
                        visible: false,
                        columnShowHide: false
                    }
                }, {
                    name: "groupTitle",
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
                    name: "groupStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupUserId",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupActivityDate",
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
        AdminGroupListPageCtrl.prototype.add = function () {
            this.$state.go("admin-group-add");
        };
        AdminGroupListPageCtrl.prototype.open = function () {
            var _this = this;
            this.adminGroupService.getGroupDetail(this.$state.params.grp).then(function (response) {
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
        AdminGroupListPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".groupListContainer .control").height() -
                30;
            return { height: containerHeight };
        };
        AdminGroupListPageCtrl.prototype.fetchData = function (query) {
            var deferred = this.$q.defer();
            this.adminGroupService.fetchData(query)
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
        AdminGroupListPageCtrl.prototype.selectRecord = function (data) {
            this.selectedRecord = data;
            this.adminGroupService.enableGroupOpen(data.id);
            this.$state.params.grp = data.id;
        };
        AdminGroupListPageCtrl.prototype.refreshGrid = function () {
        };
        return AdminGroupListPageCtrl;
    })();
    AIP.AdminGroupListPageCtrl = AdminGroupListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupListPageCtrl", AIP.AdminGroupListPageCtrl);
//# sourceMappingURL=adminGroupListPageCtrl.js.map