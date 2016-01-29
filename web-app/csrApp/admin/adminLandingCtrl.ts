///<reference path="../../typings/tsd.d.ts"/>
declare var register;

interface IAdminLandingCtrlScope extends ng.IScope {
    vm:CSR.AdminLandingCtrl;
}

module CSR {
    export class AdminLandingCtrl {
        $inject = ["$scope", "$state"];
        $state;
        landingItem;
        constructor($scope:IAdminLandingCtrlScope, $state) {
            $scope.vm = this;
            this.$state = $state;
            this.init();
        }
        init() {
            this.landingItem = [
                {
                    title:"Confirmation Maintenance",
                    icon: "info",
                    state:"admin-list",
                    description:"Create and maintain action item to require confirmations and submissions.\n" +
                        "Create Action Item overview (Name, Description, Folder, Status, From and To Dates)\n" +
                        "Define Action Item Web Pages, Fields, Text, Links, Buttons, Navigation (Page Builder)"
                }
            ];
        }
    }
}

register("bannercsr").controller("AdminLandingCtrl", CSR.AdminLandingCtrl);
