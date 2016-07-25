///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {
    interface IAdminGroupOpenPageCtrl {
       // status: IStatus;
       // folder: IFolder;
        adminGroupService: AIP.AdminGroupService;
        groupInfo: IGroupInfo;
        groupFolder: IGroupFolder;
    }
    export class AdminGroupOpenPageCtrl implements IAdminGroupOpenPageCtrl{
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter"];
        groupInfo:IGroupInfo;
        groupFolder: IGroupFolder;
      //  status: IStatus;
     //   folder: IFolder;
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
                "[vm.groupDetailResponse, vm.groupInfo]", function(newVal, oldVal) {
                    if(!$scope.$$phase) {
                        $scope.apply();
                    }
                }, true);
            this.init();
        }

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];
           // console.log(this.$state.params);
            this.adminGroupService.getGroupDetail( this.$state.params.grp).then((response:IGroupDetailResponse ) => {
                this.groupInfo = response.group;
                this.groupFolder = response.folder;

                $("#title-panel h1" ).html(this.groupInfo.title);
                $("p.openGroupTitle" ).html(this.groupInfo.title);
                $("p.openGroupFolder" ).html(this.groupFolder[0].folderName);
                $("p.openGroupStatus" ).html(this.groupInfo.status);
                $("p.openGroupDesc" ).html(this.groupFolder[0].folderDesc);
                $("p.openGroupActivityDate" ).html(this.groupFolder[0].groupActivityDate);
                $("p.openGroupLastUpdatedBy" ).html(this.groupFolder[0].groupUserId);
                //console.log(this.groupInfo);
            }, ( err ) => {
                console.log( err );
            } );


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
                var data = noti.data.newGroup[0];
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
