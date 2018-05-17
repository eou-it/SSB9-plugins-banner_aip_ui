/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupListPageCtrl = /** @class */ (function () {
        function AdminGroupListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminGroupService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
                "AdminGroupService"];
            $scope.vm = this;
            this.$state = $state;
            this.$scope = $scope;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.adminGroupService = AdminGroupService;
            this.init();
            angular.element($window).bind('resize', function () {
                $scope.$apply();
            });
            angular.element($window).bind('resize', function () {
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
                groupUserId: 3,
                groupActivityDate: 3
            };
            this.mobileSize = angular.element("body").width() > 768 ? false : true;
            this.searchConfig = {
                id: "dataTableSearch",
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
                    name: "groupName",
                    title: this.$filter("i18n_aip")("aip.list.grid.group"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.group"),
                    // width: "100px",
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
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: false
                    }
                }, {
                    name: "groupStatus",
                    title: this.$filter("i18n_aip")("aip.list.grid.status"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "postedInd",
                    title: this.$filter("i18n_aip")("aip.list.grid.postInd"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.postInd"),
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupUserId",
                    title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "groupActivityDate",
                    title: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.activityDate"),
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                }, {
                    name: "groupActions",
                    title: this.$filter("i18n_aip")("aip.list.grid.actions"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.actions"),
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
                    }
                }
            ];
        };
        AdminGroupListPageCtrl.prototype.add = function () {
            this.$state.go("admin-group-add");
        };
        AdminGroupListPageCtrl.prototype.delete = function (id) {
            //TODO:: implement delete function
            console.log("Deleging id: " + id);
        };
        AdminGroupListPageCtrl.prototype.copy = function (id) {
            //TODO:: implement copy function
            console.log("Copy id: " + id);
        };
        AdminGroupListPageCtrl.prototype.open = function (id) {
            this.$state.go("admin-group-open", { groupId: id });
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
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        AdminGroupListPageCtrl.prototype.selectRecord = function (data) {
        };
        AdminGroupListPageCtrl.prototype.deleteBlock = function (cantDeleteMessage) {
            var n = new Notification({
                message: cantDeleteMessage,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        AdminGroupListPageCtrl.prototype.deleteUnblock = function (map, name, $scope) {
            var n = new Notification({
                message: this.$filter("i18n_aip")("aip.admin.group.delete.warning"),
                type: "warning"
            });
            var actionService = this.adminGroupService;
            var keyValue = {
                groupId: map
            };
            var refreshGrid = this.$scope;
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                notifications.remove(n);
            });
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                actionService.deleteGroup(keyValue).then(function (response) {
                    if (response.data.success) {
                        refreshGrid.refreshGrid(true);
                        var n1 = new Notification({
                            message: response.data.message,
                            type: "success",
                            flash: true
                        });
                        notifications.remove(n);
                        notifications.addNotification(n1);
                    }
                    else {
                        var n2 = new Notification({
                            message: response.data.message,
                            type: "error",
                            flash: true
                        });
                        notifications.remove(n, n1);
                        notifications.addNotification(n2);
                    }
                });
            });
            notifications.addNotification(n);
        };
        AdminGroupListPageCtrl.prototype.refreshGrid = function () {
        };
        return AdminGroupListPageCtrl;
    }());
    AIP.AdminGroupListPageCtrl = AdminGroupListPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupListPageCtrl", AIP.AdminGroupListPageCtrl);
