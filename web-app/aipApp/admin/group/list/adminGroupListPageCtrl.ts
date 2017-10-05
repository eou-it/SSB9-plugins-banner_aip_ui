/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register: any;
declare var Notification: any;
declare var notifications: any;

module AIP {
    export class AdminGroupListPageCtrl {
        $inject = ["$scope", "$state", "$window", "$filter", "$q", "ENDPOINT", "PAGINATIONCONFIG",
            "AdminGroupService"];
        $state;
        $filter;
        $q: ng.IQService;
        endPoint;
        paginationConfig;
        draggableColumnNames;
        gridData;
        header;
        searchConfig;
        mobileConfig;
        mobileSize;
        adminGroupService;
        selectedRecord;

        constructor($scope, $state, $window, $filter, $q, ENDPOINT, PAGINATIONCONFIG,
            AdminGroupService) {
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.$q = $q;
            this.endPoint = ENDPOINT;   //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.adminGroupService = AdminGroupService;
            this.init();
            angular.element($window).bind('resize', function() {
                //$scope.onResize();
                $scope.$apply();
            });

            /*
        $scope.$watch("[vm.groupDetailResponse, vm.groupInfo]" , (newVal, oldVal) => {
            if(!$scope.$$phase) {
                $scope.apply();
            }
        });*/
        angular.element($window).bind('resize', function() {
            //$scope.onResize();
            $scope.$apply();
        });

        }
        init() {
            this.gridData = {};
            this.draggableColumnNames=[];
            this.mobileConfig = {
                groupTitle: 3,
                folderName: 3,
                groupStatus: 3,
                groupUserId: 3,
                groupActivityDate: 3
            };
            this.mobileSize = angular.element("body").width()>768?false:true;
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
                name: "groupName",
                title: this.$filter("i18n_aip")("aip.list.grid.group"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.group"),
                // width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    ascending:true,
                    columnShowHide: false
                }
            }, {
                name: "folderName",
                title: this.$filter("i18n_aip")("aip.list.grid.folder"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.folder"),
                // width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: false
                }
            }, {
                name: "groupStatus",
                title: this.$filter("i18n_aip")("aip.list.grid.status"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.status"),
                // width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                name: "groupUserId",
                title: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                ariaLabel: this.$filter("i18n_aip")("aip.list.grid.lastUpdated"),
                // width: "100px",
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
                // width: "100px",
                options: {
                    sortable: true,
                    visible: true,
                    columnShowHide: true
                }
            }, {
                    name: "groupActions",
                    title: this.$filter("i18n_aip")("aip.list.grid.actions"),
                    ariaLabel: this.$filter("i18n_aip")("aip.list.grid.actions"),
                    // width: "100px",
                    options: {
                        sortable: false,
                        visible: true,
                        columnShowHide: false
                    }
                }
            ];
        }

        add() {
            this.$state.go("admin-group-add");
        }
        delete(id:string) {
            //TODO:: implement delete function
            console.log("Deleging id: " + id);
        }
        copy(id:string) {
            //TODO:: implement copy function
            console.log("Copy id: "+id);
        }

        open(id:number) {
            this.adminGroupService.getGroupDetail(id).then((response) => {
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

        getHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".groupListContainer .control").height() -
                30;
            return {height: containerHeight};
        }

        fetchData(query) {
            var deferred = this.$q.defer();
            this.adminGroupService.fetchData(query)
                .then((response) => {
                    // this.gridData = response;
                    // this.gridData.header = this.header;
                    deferred.resolve(response);
                }, (error) => {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }
        selectRecord(data) {
            // this.selectedRecord = data;
            // this.adminGroupService.enableGroupOpen(data.id);
            // this.$state.params.grp = data.id;

        }
        refreshGrid() {

        }
    }
}

register("bannerAIP").controller("AdminGroupListPageCtrl", AIP.AdminGroupListPageCtrl);