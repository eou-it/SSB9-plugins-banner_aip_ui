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
        $inject = ["$scope", "$q", "$state", "$filter", "SpinnerService", "AdminActionService" ];
        status: [AIP.IStatus];
        folders: [AIP.IFolder];
        actionItemInfo: AIP.IActionItemParam|any;
        errorMessage:any;
        adminActionService:AIP.AdminActionService;
        spinnerService:AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        constructor($scope:IActionItemAddPageScope, $q:ng.IQService, $state, $filter,
                    SpinnerService:AIP.SpinnerService, AdminActionService:AIP.AdminActionService) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
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
                        var actionItemStatus:any = $("#actionItemStatus");
                        this.actionItemInfo.status = this.status[0].id;
                        actionItemStatus.select2({
                            width: "25em",
                            minimumResultsForSearch: Infinity,
                            // placeholderOption: "first"
                        });
                        //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                        $(".actionItemStatus .select2-container.actionItemSelect .select2-chosen")[0].innerHTML = this.$filter("i18n_aip")(this.status[0].value);
                    })
            );
            allPromises.push(
                this.adminActionService.getFolder()
                    .then((response:AIP.IActionItemFolderResponse) => {
                        this.folders = response.data;
                        var actionItemFolder:any = $("#actionItemFolder");
                        actionItemFolder.select2( {
                            width: "25em",
                            minimumResultsForSearch:Infinity,
                            placeholderOption: "first"
                        });
                    })
            );
            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
        }
        validateInput() {
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
            this.adminActionService.saveActionItem(this.actionItemInfo)
                .then((response:AIP.IActionItemSaveResponse) => {
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