///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {
    interface IAdminGroupOpenPageCtrl {
        adminGroupService: AIP.AdminGroupService;
        groupStatus: IStatus;
        groupInfo: IGroupInfo;
        groupFolder: IGroupFolder;
    }
    export class AdminGroupOpenPageCtrl implements IAdminGroupOpenPageCtrl{
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce"];
        groupInfo:IGroupInfo;
        groupFolder: IGroupFolder;
        groupStatus: IStatus;
        adminGroupService: AIP.AdminGroupService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        $sce;
        constructor($scope, AdminGroupService:AIP.AdminGroupService,
                    $q:ng.IQService, SpinnerService, $state, $filter, $sce) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.init();
        }

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];

            this.groupFolder = this.$state.params.data;
            console.log(this.groupFolder);
            //var groupDescHtml = this.$sce.trustAsHtml(this.$state.params.data.description);
            //console.log(groupDescHtml);
            //todo: replace this temporary workaround for sce not working for description
            $("p.openGroupDesc" ).html(this.$state.params.data.groupDesc);
            $("#title-panel h1" ).html(this.$state.params.data.groupName);

            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            this.$q.all( promises ).then( () => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner( false );
            } );
        };

        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                var data = noti.data.group[0];
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"), //+
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".groupAddContainer").focus();
                }, 500);
            }
        }
    }

}

register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
