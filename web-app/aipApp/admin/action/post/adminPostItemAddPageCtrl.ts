/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;


module AIP {
    interface IAdminPostItemAddPageCtrl {
        validateInput(): boolean;
        cancel(): void;
        save(): void;
        saveErrorCallback(message: string): void;
    }
    interface IActionItemAddPageScope {
        vm: AdminPostItemAddPageCtrl;
    }

    export class AdminPostItemAddPageCtrl implements IAdminPostItemAddPageCtrl{
        $inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionService","$uibModal","APP_ROOT","datePicker"];
        $scope;
        $uibModal;
        status: [AIP.IStatus];
        folders: [AIP.IFolder];
        groupList: [AIP.IGroup];
        actionItemList: [AIP.IGroupActionItem];
        populationList:[AIP.IPopulation];
        postActionItemInfo: AIP.IPostActionItemParam|any;
        errorMessage:any;
        adminActionService:AIP.AdminActionService;
        spinnerService:AIP.SpinnerService;
        saving: boolean;
        $q: ng.IQService;
        $state;
        $filter;
        APP_ROOT;
        modalInstance;
        $timeout;
        constructor($scope:IActionItemAddPageScope, $q:ng.IQService, $state,$uibModal, $filter, $timeout,
                    SpinnerService:AIP.SpinnerService,APP_ROOT, AdminActionService:AIP.AdminActionService) {
            $scope.vm = this;
            this.$q = $q;
            this.$scope = $scope;
            this.$state = $state;
            this.$filter = $filter;
            this.$uibModal = $uibModal;
            this.modalInstance;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.APP_ROOT = APP_ROOT;
            this.errorMessage = {};
            this.init();
        }
        groupFunc(item) {
            return item.folderName;
        }
        populationFunc(item) {
            return item.populationFolderName;
        }
        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.postActionItemInfo = {};

            allPromises.push(
                this.adminActionService.getGrouplist()
                    .then((response:AIP.IPostActionItemGroupResponse) => {
                        this.groupList = response.data;
                        console.log(this.groupList)
                        var postActionItemGroup:any = $("#postActionItemGroup");
                        //this.postActionItemInfo["group"] = [];
                        this.postActionItemInfo.group = this.groupList;
                        console.log(this.postActionItemInfo.group)

                    })
            );


            allPromises.push(
                this.adminActionService.getPopulationlist()
                    .then((response:AIP.IPostActionItemPopulationResponse) => {
                        this.populationList = response.data;
                        console.log(this.groupList)
                        var postActionItemPopulation:any = $("#postActionItemPopulation");
                        this.postActionItemInfo.population = this.populationList;

                    })
            );


            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
        }
        changedValue(item){
this.$scope = item.groupId;
var groupId = this.$scope;
console.log(this.$scope);
            this.adminActionService.getGroupActionItem(groupId)
                .then((response:AIP.IPostActionItemResponse) => {
                    this.actionItemList = response.data;
                    console.log(this.actionItemList);
                    var postActionItemGroup:any = $("#ActionItemGroup");
                    this.postActionItemInfo["groupAction"] = [];
                    this.postActionItemInfo.groupAction = this.actionItemList;
                })

        }


        editPage() {
            this.modalInstance = this.$uibModal.open({
                templateUrl: this.APP_ROOT + "admin/action/post/addpost/postAddTemplate.html",
                controller: "PostAddModalCtrl",
                controllerAs: "$ctrl",
                size: "md",
                windowClass: "aip-modal",
                resolve: {
                    actionItemModal:() => {
                            return this.postActionItemInfo.groupAction;
                    }
                }
            });
            this.modalInstance.result.then((result) => {
                console.log(result);
                if (result.success) {
                    //TODO:: send notification and refresh grid
                    var n = new Notification({
                        message: this.$filter("i18n_aip")("aip.common.save.successful"),
                        type: "success",
                        flash: true
                    });
                    notifications.addNotification(n);
                    this.$scope.refreshGrid(true);  //use scope to call grid directive's function
                    // this.refreshGrid(true);
                } else {
                    //TODO:: send error notification
                }
            }, (error) => {
                console.log(error);
            });
        }

        validateInput() {
            if(this.saving) {
                return false;
            }
            /*if(!this.actionItemInfo.name || this.actionItemInfo.name === null || this.actionItemInfo.name === "" ) {
             this.errorMessage.name = "invalid title";
             } else {
             delete this.errorMessage.name;
             }*/

            /* if(!this.postactionItemInfo.folder) {
             this.errorMessage.folder = "invalid folder";
             } else {
             delete this.errorMessage.folder;
             }
             if(!this.postactionItemInfo.description || this.postactionItemInfo.description === null || this.postactionItemInfo.description === "" ) {
             this.errorMessage.description = "invalid description";
             } else {
             delete this.errorMessage.description;
             }
             if(!this.postactionItemInfo.title || this.postactionItemInfo.title === null || this.postactionItemInfo.title === "" || this.postactionItemInfo.title.length > 300) {
             this.errorMessage.title = "invalid title";
             } else {
             delete this.errorMessage.title;
             }
             if(Object.keys(this.errorMessage).length>0) {
             return false;
             } else {
             return true;
             }*/
        }
        cancel() {
            this.$state.go("admin-action-list");
        }
        save() {
            this.saving = true;
            this.adminActionService.savePostActionItem(this.postActionItemInfo)
                .then((response:AIP.IActionItemSaveResponse) => {
                    this.saving = false;
                    var notiParams = {};
                    if(response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.$state.go("admin-post-add", {noti: notiParams, data: response.data.newActionItem.id});
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

register("bannerAIP").controller("AdminPostItemAddPageCtrl", AIP.AdminPostItemAddPageCtrl);
register("bannerAIP").controller("PostAddModalCtrl", AIP.PostAddModalCtrl);
