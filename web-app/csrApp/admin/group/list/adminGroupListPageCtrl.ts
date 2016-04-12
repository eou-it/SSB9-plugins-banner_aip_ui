//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register;

module CSR {
    export class AdminGroupListPageCtrl {
        $inject = ["$scope"];
        constructor($scope) {
            $scope.vm = this;
        }
    }
}

register("bannercsr").controller("AdminGroupListPageCtrl", CSR.AdminGroupListPageCtrl);