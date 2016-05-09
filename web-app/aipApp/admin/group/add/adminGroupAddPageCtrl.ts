///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

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
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter"];
        status: AIP.IStatus[];
        folders: AIP.IFolder[];
        groupInfo: IGroupInfo;
        errorMessage;
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
            this.errorMessage = {};
            $scope.$watch(
                "[vm.status, vm.folders, vm.groupInfo.folder, vm.groupInfo.status]", function(newVal, oldVal) {
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
                    var groupStatus:any = $("#groupStatus");
                    groupStatus
                        .select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });

                })
            );
            promises.push(
                this.adminGroupService.getFolder().then((folders) => {
                    this.folders = folders;
                    var groupFolder:any = $("#groupFolder");
                    groupFolder.select2( {
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });
                })
            );
            this.$q.all(promises).then(() => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner(false);

                this.groupInfo.status = this.status[0];
            });
        }
        save() {
            this.adminGroupService.saveGroup(this.groupInfo)
                .then((response:IAddGroupResponse) => {
                    var notiParams = {};
                    if(response.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response
                        };
                        this.$state.go("admin-group-list", {noti: notiParams});
                    } else {
                        this.saveErrorCallback(response.invalidField);
                    }
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
        }
        cancel() {
            this.$state.go("admin-group-list");
        }
        validateInput() {
            if(!this.groupInfo.title || this.groupInfo.title === null || this.groupInfo.title === "" || this.groupInfo.title.length > 60) {
                this.errorMessage.title = "invalid title";
            } else {
                delete this.errorMessage.title;
            }
            if(!this.groupInfo.folder) {
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
        saveErrorCallback(invalidFields) {
            var message = this.$filter("i18n_aip")("aip.admin.group.add.error.blank")
            angular.forEach(invalidFields, (field) => {
                if(field === "group status") {
                    message += "</br>" + this.$filter("i18n_aip")("admin.group.add.error.noStatus");
                }
                if(field === "folder") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noFolder");
                }
                if(field === "group title") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noTitle");
                }
            });
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }


    }
}

register("bannerAIP").controller("AdminGroupAddPageCtrl", AIP.AdminGroupAddPageCtrl);
