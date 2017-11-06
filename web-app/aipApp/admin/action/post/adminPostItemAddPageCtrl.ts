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
        $inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService","AdminActionService","$uibModal","APP_ROOT","datePicker"];
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
        selected;
        modalResult;
        postNow:boolean;
        selectedPopulation;
        modalResults;
        itemLength;
        regeneratePopulation:boolean;
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
            this.selected = {};
            this.modalResult={};
            this.modalResults=[];
            this.regeneratePopulation=false;
            this.itemLength;
            this.selectedPopulation={};
            this.postNow=true;
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
                        var postActionItemGroup:any = $("#postActionItemGroup");
                        //this.postActionItemInfo["group"] = [];
                        this.postActionItemInfo.group = this.groupList;

                    })
            );


            allPromises.push(
                this.adminActionService.getPopulationlist()
                    .then((response:AIP.IPostActionItemPopulationResponse) => {
                        this.populationList = response.data;
                        var postActionItemPopulation:any = $("#postActionItemPopulation");
                        this.postActionItemInfo.population = this.populationList;

                    })
            );


            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
        }
        changedValue(){

var groupId = this.$scope;
console.log(this.$scope);
            this.adminActionService.getGroupActionItem(this.selected.groupId)
                .then((response:AIP.IPostActionItemResponse) => {
                    this.actionItemList = response.data;
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
                console.log(result)
                this.itemLength=result.length;
                result.forEach((item, index) => {
                    this.modalResult=item;
                    this.modalResults.push(this.modalResult.actionItemId);
                });

            }, (error) => {
                console.log(error);
            });
        }
        start(){
            console.log(this.postActionItemInfo.startDate)
        }
        validateInput() {
            if(this.saving) {
                return false;
            }
           if(!this.postActionItemInfo.name || this.postActionItemInfo.name === null || this.postActionItemInfo.name === "" ) {

                console.log(this.postActionItemInfo.name)
               this.errorMessage.name = "invalid title";
             } else {
             delete this.errorMessage.name;
             }

            if(!this.postActionItemInfo.startDate || this.postActionItemInfo.startDate === null || this.postActionItemInfo.startDate === "" ) {
                console.log(this.postActionItemInfo.startDate)
                this.errorMessage.startDate = "invalid StartDate";
            } else {
                delete this.errorMessage.startDate;
            }
            if(!this.postActionItemInfo.endDate || this.postActionItemInfo.endDate === null || this.postActionItemInfo.endDate === "" ) {
                this.errorMessage.endDate = "invalid EndDate";
            } else {
                delete this.errorMessage.endDate;
            }

            if(!this.selected) {
             this.errorMessage.postGroupId = "invalid group";
             } else {
             delete this.errorMessage.postGroupId;
             }
           if(!this.selectedPopulation ) {

             this.errorMessage.population = "invalid population";
             } else {
             delete this.errorMessage.population;
             }
            if(!this.modalResult==null) {
                this.errorMessage.success = "invalid actionItem";
            } else {
                delete this.errorMessage.success;
            }
             if(Object.keys(this.errorMessage).length>0) {
             return false;
             } else {
             return true;
             }
        }
        cancel() {
            this.$state.go("admin-post-list");
        }
        save() {
            this.saving = true;
            this.adminActionService.savePostActionItem(this.postActionItemInfo,this.selected,this.modalResults,this.selectedPopulation,this.postNow,this.regeneratePopulation)
                .then((response:AIP.IPostActionItemSaveResponse) => {
                    this.saving = false;
                    var notiParams = {};
                    if(response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.$state.go("admin-post-list", {noti: notiParams, data: response.data.savedJob.id});
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

