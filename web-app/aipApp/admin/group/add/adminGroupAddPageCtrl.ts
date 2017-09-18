///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;
declare var CKEDITOR;


module AIP {
    interface IAdminGroupAddPageCtrl {
        status: AIP.IStatus[];
        folders: AIP.IFolder[];
        adminGroupService: AIP.AdminGroupService;
        groupInfo: IGroupSelect;
        errorMessage;
        save(): void;
        cancel(): void;
    }
    interface IGroupSelect {
        title: string;
        name: string;
        status: string|number;
        folder: number|string;
        description: string;
    }
    export class AdminGroupAddPageCtrl implements IAdminGroupAddPageCtrl{
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "CKEDITORCONFIG"];
        status: AIP.IStatus[];
        folders: AIP.IFolder[];
        groupInfo: IGroupSelect;
        errorMessage;
        saving: boolean;
        adminGroupService: AIP.AdminGroupService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        $sce;
        ckEditorConfig;
        constructor($scope, AdminGroupService:AIP.AdminGroupService,
            $q:ng.IQService, SpinnerService, $state, $filter, $sce, CKEDITORCONFIG) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.ckEditorConfig = CKEDITORCONFIG
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.saving = false;
            this.errorMessage = {};
            this.errorMessage = {};
            $scope.$watch(
                "[vm.status, vm.folders, vm.groupInfo.folder, vm.groupInfo.status, vm.groupInfo.description]", function(newVal, oldVal) {
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
                    this.groupInfo.status = this.status[0].id;
                    groupStatus
                        .select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity,
                        // placeholderOption:'first'
                    });
                    //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                    $(".groupStatus .select2-container.groupSelect .select2-chosen")[0].innerHTML = this.$filter("i18n_aip")(this.status[0].value);
                })
            );
            promises.push(
                this.adminGroupService.getFolder().then((folders) => {
                    this.folders = folders;
                    var groupFolder:any = $("#groupFolder");
                    groupFolder.select2( {
                        width: "25em",
                        minimumResultsForSearch: Infinity,
                        placeholderOption:'first'
                    });
                })
            );
            this.$q.all(promises).then(() => {
                this.spinnerService.showSpinner(false);
                this.trustGroupDesc();
            });
        }
        save() {
            this.saving = true;
            this.adminGroupService.saveGroup(this.groupInfo)
                .then((response:IAddGroupResponse) => {
                    this.saving = false;
                    var notiParams = {};
                    if(response.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response
                        };
                        this.$state.go("admin-group-open", {noti: notiParams, data: response.group});
                    } else {
                        this.saveErrorCallback(response.invalidField, response.errors, response.message);
                    }
                }, (err) => {
                    this.saving = false;
                    //TODO:: handle error call
                    console.log(err);
                });
        }
        cancel() {
            this.$state.go("admin-group-list");
        }
        validateInput() {
            if(this.saving) {
                return false;
            }
            if(!this.groupInfo.title || this.groupInfo.title === null || this.groupInfo.title === "" || this.groupInfo.title.length > 60) {
                this.errorMessage.title = "invalid title";
            } else {
                delete this.errorMessage.title;
            }
            if(!this.groupInfo.name || this.groupInfo.name === null || this.groupInfo.name === "" || this.groupInfo.name.length > 60) {
                this.errorMessage.name = "invalid name";
            } else {
                delete this.errorMessage.name;
            }
            if(!this.groupInfo.folder) {
                this.errorMessage.folder = "invalid folder";
            } else {
                delete this.errorMessage.folder;
            }
            if(!this.groupInfo.description || this.groupInfo.description === null || this.groupInfo.description === "" ) {
                this.errorMessage.description = "invalid description";
            } else {
                delete this.errorMessage.description;
            }
            if(Object.keys(this.errorMessage).length>0) {
                return false;
            } else {
                return true;
            }
        }

        trustGroupDesc = function() {
            this.groupInfo.description = this.$filter("html")(this.$sce.trustAsHtml(this.groupInfo.description));
            return this.groupInfo.description;
        }

        saveErrorCallback(invalidFields, errors, message) {
           //todo: iterate through errors given back through contraints
            /*
            errors.forEach( function(e, i) {
                message += (e[i]);
            });
            */
            var message = this.$filter("i18n_aip")(message||"aip.admin.group.add.error.blank")
            if (errors != null) {
                message = errors[0]
            }

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
                if(field === "group name") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noName");
                }
                if(field === "group description") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noDesc");
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
