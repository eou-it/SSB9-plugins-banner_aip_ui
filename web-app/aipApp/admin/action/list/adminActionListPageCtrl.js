///<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var AdminActionListPageCtrl = (function () {
        function AdminActionListPageCtrl($scope, $state, $window, $filter, ENDPOINT, PAGINATIONCONFIG, AdminActionService) {
            this.$inject = ["$scope", "$state", "$window", "$filter", "ENDPOINT", "PAGINATIONCONFIG",
                "AdminActionService"];
            $scope.vm = this;
            this.$state = $state;
            this.$filter = $filter;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.paginationConfig = PAGINATIONCONFIG;
            this.actionListService = AdminActionService;
            this.init();
            angular.element($window).bind('resize', function () {
                //$scope.onResize();
                $scope.$apply();
            });
            $scope.$watch("[vm.gridData]", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            });
        }
        AdminActionListPageCtrl.prototype.init = function () {
            var _this = this;
            //todo: anything needing to be moved here?
            this.gridData = {};
            this.actionListService.getActionLists()
                .then(function (response) {
                _this.gridData.rows = response.data;
            }, function (err) {
                console.log(err);
            });
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
            this.actionListService.fetchData(query)
                .then(function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
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