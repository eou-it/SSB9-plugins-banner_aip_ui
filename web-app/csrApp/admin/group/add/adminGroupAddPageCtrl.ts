///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>

declare var register;

module CSR {
    interface IAdminGroupAddPageCtrl {
        status: CSR.IStatus[];
        folders: CSR.IFolder[];
        adminGroupService: CSR.AdminGroupService;
        groupInfo: IGroupInfo;
        save(): void;
        cancel(): void;
    }
    interface IGroupInfo {
        title: string;
        status: CSR.IStatus;
        folder: CSR.IFolder;
    }
    export class AdminGroupAddPageCtrl implements IAdminGroupAddPageCtrl{
        $inject = ["$scope", "AdminGroupService", "$q"];
        status: CSR.IStatus[];
        folders: CSR.IFolder[];
        groupInfo: IGroupInfo;
        adminGroupService: CSR.AdminGroupService;
        $q: ng.IQService;
        constructor($scope, AdminGroupService:CSR.AdminGroupService,
            $q:ng.IQService) {
            $scope.vm = this;
            this.$q = $q;
            this.adminGroupService = AdminGroupService;

            $scope.$watch(
                "[vm.status, vm.folders]", function(newVal, oldVal) {
                    if(!$scope.$$phase) {
                        $scope.apply();
                    }
                }, true);
            this.init();
        }

        init() {
            //TODO::trun on the spinner
            var promises = [];
            this.groupInfo = <any>{};
            promises.push(
                this.adminGroupService.getStatus().then((status) => {
                    this.status = status;
                })
            );
            promises.push(
                this.adminGroupService.getFolder().then((folders) => {
                    this.folders = folders;
                })
            );
            this.$q.all(promises).then(() => {
                //TODO:: turn off the spinner
                this.groupInfo.status = this.status[0];
                this.groupInfo.folder = this.folders[0];
            });
        }
        save() {

        }
        cancel() {

        }
        selectStatus(item:IStatus) {
            this.groupInfo.status = item;
        }
        selectFolder(item:IFolder) {
            this.groupInfo.folder = item;
        }

    }
}

register("bannercsr").controller("AdminGroupAddPageCtrl", CSR.AdminGroupAddPageCtrl);
