///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;

module AIP {
    interface IAdminGroupAddPageCtrl {
        status: AIP.IStatus[];
        folders: AIP.IFolder[];
        adminGroupService: AIP.AdminGroupService;
        groupInfo: IGroupInfo;
        errorMessage;
        save(): void;
        cancel(): void;
    }
    export class AdminGroupAddPageCtrl implements IAdminGroupAddPageCtrl{
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state"];
        status: AIP.IStatus[];
        folders: AIP.IFolder[];
        groupInfo: IGroupInfo;
        errorMessage;
        adminGroupService: AIP.AdminGroupService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        constructor($scope, AdminGroupService:AIP.AdminGroupService,
            $q:ng.IQService, SpinnerService, $state) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.errorMessage = {};
            $scope.$watch(
                "[vm.status, vm.folders]", function(newVal, oldVal) {
                    if(!$scope.$$phase) {
                        $scope.apply();
                    }
                }, true);
            this.init();

        }

        init() {
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupInfo = <any>{};
            promises.push(
                this.adminGroupService.getStatus().then((status) => {
                    this.status = status.map((item) => {
                        item.value = "aip.status." + item.value;
                        return item;
                    });
                    $("#groupStatus").select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });

                })
            );
            promises.push(
                this.adminGroupService.getFolder().then((folders) => {
                    var defaultFolder = {
                        id: false,
                        name: "Please select the folder"
                    };
                    //folders.unshift(defaultFolder);
                    this.folders = folders;
                    $("#groupFolder").select2( {
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    }
                    );
                })
            );
            this.$q.all(promises).then(() => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner(false);

                //this.groupInfo.status = this.status[0];
                //this.groupInfo.folder = this.folders[0];
            });
        }
        save() {
            this.adminGroupService.saveGroup(this.groupInfo)
                .then((response) => {
                    var notiParams = {
                        notiType: "saveSuccess",
                        data: response
                    };
                    this.$state.go("admin-group-list", {noti:notiParams});
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
        }
        cancel() {
            this.$state.go("admin-group-list");
        }
        selectStatus(item:IStatus) {
            this.groupInfo.status = item;
        }
        selectFolder(item:IFolder) {
            this.groupInfo.folder = item;
        }
        validateInput() {
            if(!this.groupInfo.title || this.groupInfo.title === null || this.groupInfo.title === "" || this.groupInfo.title.length > 60) {
                this.errorMessage.title = "invalid title";
            } else {
                delete this.errorMessage.title;
            }
            if(!this.groupInfo.folder || this.groupInfo.folder.id===false) {
                this.errorMessage.folder = "invalid folder";
            } else {
                delete this.errorMessage.folder;
            }
            if(Object.keys(this.errorMessage).length>0) {
                return false;
            } else {
                return true;
            }
        }


    }
}

register("bannerAIP").controller("AdminGroupAddPageCtrl", AIP.AdminGroupAddPageCtrl);
