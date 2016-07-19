///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {
    interface IAdminGroupOpenPageCtrl {
        //status: AIP.IStatus[];
        //folders: AIP.IFolder[];
        adminGroupService: AIP.AdminGroupService;
        groupDetail: IGroupDetailResponse;
    }
    export class AdminGroupOpenPageCtrl implements IAdminGroupOpenPageCtrl{
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter"];
        groupDetail:IGroupDetailResponse;
        adminGroupService: AIP.AdminGroupService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        constructor($scope, AdminGroupService:AIP.AdminGroupService,
                    $q:ng.IQService, SpinnerService, $state, $filter) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            $scope.$watch(
                "[vm.groupDetailResponse]", function(newVal, oldVal) {
                    if(!$scope.$$phase) {
                        $scope.apply();
                    }
                }, true);
            this.init();
        }

        init() {
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupDetail = <any>{};

            if(this.$state.params.grp) {
                this.displayGroup();
            }
            /*
            promises.push(
                this.adminGroupService.getGroupDetail(this.$state.params.grp.groupId).then((status) => {
                })
            );
            */
            this.$q.all(promises).then(() => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner(false);
            });
        }
        displayGroup() {
            console.log(this.$state.params.grp);
            $("#title-panel h1" ).html(this.$state.params.grp.title);
        }
    }

}

register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
