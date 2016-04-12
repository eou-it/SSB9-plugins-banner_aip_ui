//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register;

module CSR {
    export class AdminGroupListPageCtrl {
        $inject = ["$scope", "AdminGroupService", "$state"];
        gridData: IGridData;
        $state;
        adminGroupService: CSR.AdminGroupService;
        constructor($scope, AdminGroupService, $state) {
            $scope.vm = this;
            this.adminGroupService = AdminGroupService
            this.$state = $state;
            this.init();
            $scope.$watch("vm.gridData", (newVal, oldVal) => {
                if(!$scope.$$phase) {
                    $scope.apply();
                }
            });
        }
        init() {
            this.adminGroupService.getGroupList().then((response:IGridData) => {
                this.gridData = response;
            }, (err) => {
                console.log(err);
            });
        }
        add() {
            this.$state.go("admin-group-add");
        }
    }
}

register("bannercsr").controller("AdminGroupListPageCtrl", CSR.AdminGroupListPageCtrl);