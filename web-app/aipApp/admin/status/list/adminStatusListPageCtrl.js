//*******************************************************************************
//Copyright 2017 Ellucian Company L.P. and its affiliates.
//*******************************************************************************-
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var AdminStatusListPageCtrl = (function () {
        function AdminStatusListPageCtrl($scope, $state, $window, $filter, $q, $uibModal, ENDPOINT, PAGINATIONCONFIG, AdminActionStatusService, APP_ROOT) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "$uibModal",
                "ENDPOINT", "PAGINATIONCONFIG", "AdminActionStatusService", "APP_ROOT"];
            $scope.vm = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.modalInstance;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
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
                actionItemSystemRequired: 3,
                actionItemLastUpdatedBy: 3,
                actionItemActivityDate: 3,
                actionItemStatusNotification: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "statusDataTableSearch",
                delay: 300,
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.search.status"),
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
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        ascending: true,
                        columnShowHide: false
                    }
                },
                {
                    name: "actionItemStatusSystemRequired",
                    title: this.$filter("i18n_aip")("aip.list.grid.systemRequired"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.systemRequired"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "actionItemStatusUserId",
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
                },
                {
                    name: "actionTobeTaken",
                    title: this.$filter("i18n_aip")("aip.list.grid.actionTobeTaken"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.actionTobeTaken"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: true
                    }
                }
            ];
        };
        AdminStatusListPageCtrl.prototype.getIndicatorVal = function () {
        };
        AdminStatusListPageCtrl.prototype.goAddPage = function () {
            var _this = this;
            this.modalInstance = this.$uibModal.open({
                templateUrl: this.APP_ROOT + "admin/status/list/add/statusAddTemplate.html",
                controller: "StatusAddModalCtrl",
                controllerAs: "$ctrl",
                size: "sm",
                windowClass: "aip-modal"
            });
            this.modalInstance.result.then(function (result) {
                console.log(result);
                if (result.success) {
                    //TODO:: send notification and refresh grid
                    var n = new Notification({
                        message: _this.$filter("i18n_aip")("aip.common.save.successful"),
                        type: "success",
                        flash: true
                    });
                    notifications.addNotification(n);
                    _this.$scope.refreshGrid(true); //use scope to call grid directive's function
                    // this.refreshGrid(true);
                }
                else {
                    //TODO:: send error notification
                }
            }, function (error) {
                console.log(error);
            });
        };
        AdminStatusListPageCtrl.prototype.deleteSystemRecord = function (message) {
            var n = new Notification({
                message: this.$filter("i18n_aip")("aip.common.save.deleteSystemRecord"),
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        AdminStatusListPageCtrl.prototype.disableSystemRecord = function () {
            this.modalInstance = function (e) {
                e.preventDefault();
            };
        };
        /*
        add() {
            this.$state.go("admin-group-add");
        }

        open() {
            this.adminActionStatusService.getGroupDetail(this.$state.params.status).then((response) => {
                if(response.group) {
                    this.$state.go("admin-group-open", {data: response.group});
                } else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
            }, (err) => {
                //TODO:: handle error call
                console.log(err);
            });
        }
        */
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
            //this.adminActionStatusService.enableGroupOpen(data.id);
            //this.$state.params.grp = data.id;
        };
        return AdminStatusListPageCtrl;
    }());
    AIP.AdminStatusListPageCtrl = AdminStatusListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminStatusListPageCtrl", AIP.AdminStatusListPageCtrl);
