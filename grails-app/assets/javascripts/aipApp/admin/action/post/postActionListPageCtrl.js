/*******************************************************************************
 Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var PostActionListPageCtrl = /** @class */ (function () {
        function PostActionListPageCtrl($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG, AdminActionService) {
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.actionListService = AdminActionService;
            this.localeTime = {};
            this.timezones = {};
            this.init();
            angular.element($window).bind('resize', function () {
                $scope.$apply();
            });
        }
        PostActionListPageCtrl.prototype.init = function () {
            var _this = this;
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
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
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
                    name: "groupFolderName",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.folder"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.folder"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "postingPopulation",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.population"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.population"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "groupName",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.name"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.group.name"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: true
                    }
                },
                {
                    name: "postingCreatorId",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.submittedBy"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.submittedBy"),
                    width: "100px",
                    options: {
                        sortable: true,
                        visible: true,
                        columnShowHide: false
                    }
                },
                {
                    name: "postingActionStatus",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.actionstatus"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.actionstatus"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
                    }
                },
                {
                    name: "recurrenceAction",
                    title: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.recurrenceAction"),
                    ariaLabel: this.$filter("i18n_aip")("aip.admin.actionItem.post.grid.job.recurrenceAction"),
                    width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
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
        PostActionListPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.common.save.successful"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
        };
        PostActionListPageCtrl.prototype.fetchTableData = function (query) {
            var deferred = this.$q.defer();
            var am = this.$filter("i18n_aip")("aip.admin.communication.timepicker.time.am.label");
            var pm = this.$filter("i18n_aip")("aip.admin.communication.timepicker.time.pm.label");
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
        PostActionListPageCtrl.prototype.selectRecord = function (data) {
            this.selectedRecord = data;
        };
        PostActionListPageCtrl.prototype.refreshGrid = function () {
        };
        PostActionListPageCtrl.prototype.goAddPage = function () {
            this.$state.go("admin-post-add");
        };
        PostActionListPageCtrl.prototype.openActionItem = function () {
            this.$state.go("admin-action-open", { data: this.selectedRecord.id });
        };
        PostActionListPageCtrl.prototype.editActionItem = function (postId) {
            var _this = this;
            this.actionListService.getPostStatus(postId)
                .then(function (response) {
                if (notifications.length !== 0) {
                    notifications.remove(notifications.first());
                }
                if (response === "Y") {
                    _this.$state.go("admin-post-edit", { postIdval: postId, isEdit: true });
                }
                else {
                    if (notifications.length !== 0) {
                        notifications.remove(notifications.first());
                    }
                    var n = new Notification({
                        message: _this.$filter("i18n_aip")("aip.common.post.edit.noaccess"),
                        type: "error",
                        flash: true
                    });
                    setTimeout(function () {
                        notifications.addNotification(n);
                        _this.$state.params.noti = undefined;
                        $(".actionItemAddContainer").focus();
                    }, 100);
                }
            }, function (err) {
                throw new Error(err);
            });
        };
        PostActionListPageCtrl.prototype.recurringPostDetails = function (postId) {
            this.$state.go("admin-recurring-post-list", { postIdval: postId });
        };
        PostActionListPageCtrl.$inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG", "AdminActionService"];
        return PostActionListPageCtrl;
    }());
    AIP.PostActionListPageCtrl = PostActionListPageCtrl;
})(AIP || (AIP = {}));
angular.module("bannerAIP").controller("PostActionListPageCtrl", AIP.PostActionListPageCtrl);
