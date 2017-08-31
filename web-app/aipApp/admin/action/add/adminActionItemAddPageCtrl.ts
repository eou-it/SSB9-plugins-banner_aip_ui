///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;


module AIP {
    interface IAdminActionItemAddPageCtrl {
        validateInput(): boolean;
        cancel(): void;
        save(): void;
        saveErrorCallback(message: string): void;
    }
    interface IActionItemAddPageScope {
        vm: AdminActionItemAddPageCtrl;
    }

    export class AdminActionItemAddPageCtrl implements IAdminActionItemAddPageCtrl{
        $inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionService" ];
        status: [AIP.IStatus];
        folders: [AIP.IFolder];
        actionItemInfo: AIP.IActionItemParam|any;
        errorMessage:any;
        adminActionService:AIP.AdminActionService;
        spinnerService:AIP.SpinnerService;
        saving: boolean;
        $q: ng.IQService;
        $state;
        $filter;
        $timeout;
        constructor($scope:IActionItemAddPageScope, $q:ng.IQService, $state, $filter, $timeout,
                    SpinnerService:AIP.SpinnerService, AdminActionService:AIP.AdminActionService) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.errorMessage = {};
            this.init();
        }

        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.actionItemInfo = {};
            allPromises.push(
                this.adminActionService.getStatus()
                    .then((response: AIP.IActionItemStatusResponse) => {
                        this.status = response.data;
                        angular.forEach(this.status,function(key,value){
                            key.value =  "aip.status." + key.value;
                            console.log(key.value)
                            return value;
                        });
                        var actionItemStatus:any = $("#actionItemStatus");
                        this.actionItemInfo.status = this.status[0];
                        this.$timeout(()=> {
                            actionItemStatus.select2({
                                width: "25em",
                                minimumResultsForSearch: Infinity
                            });
                        }, 50);
                    })
            );
            allPromises.push(
                this.adminActionService.getFolder()
                    .then((response:AIP.IActionItemFolderResponse) => {
                        this.folders = response.data;
                        var actionItemFolder:any = $("#actionItemFolder");
                        this.actionItemInfo.folder = this.folders[0];
                        this.$timeout(() => {
                            actionItemFolder.select2( {
                                width: "25em",
                                minimumResultsForSearch:Infinity
                            });
                        }, 50);
                    })
            );
            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
        }
        validateInput() {
            if(this.saving) {
                return false;
            }
            if(!this.actionItemInfo.title || this.actionItemInfo.title === null || this.actionItemInfo.title === "" || this.actionItemInfo.title.length > 300) {
                this.errorMessage.title = "invalid title";
            } else {
                delete this.errorMessage.title;
            }
            if(!this.actionItemInfo.folder) {
                this.errorMessage.folder = "invalid folder";
            } else {
                delete this.errorMessage.folder;
            }
            if(!this.actionItemInfo.description || this.actionItemInfo.description === null || this.actionItemInfo.description === "" ) {
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
        cancel() {
            this.$state.go("admin-action-list");
        }
        save() {
            this.saving = true;
            this.adminActionService.saveActionItem(this.actionItemInfo)
                .then((response:AIP.IActionItemSaveResponse) => {
                    this.saving = false;
                    var notiParams = {};
                    if(response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.$state.go("admin-action-open", {noti: notiParams, data: response.data.newActionItem.id});
                    } else {
                        this.saveErrorCallback(response.data.message);
                    }
                }, (err) => {
                    this.saving = false;
                    //TODO:: handle error call
                    console.log(err);
                });
        }
        saveErrorCallback(message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }
    }
}

register("bannerAIP").controller("AdminActionItemAddPageCtrl", AIP.AdminActionItemAddPageCtrl);