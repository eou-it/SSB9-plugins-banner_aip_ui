//<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register;

module CSR {
    export class AdminGroupListPageCtrl {
        $inject = [];
        constructor() {

        }
    }
}

register("bannercsr").controller("AdminGroupListPageCtrl", CSR.AdminGroupListPageCtrl);