/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
        dataChanged():void;
    }
    interface IActionItemAddPageScope {
        vm: AdminActionItemAddPageCtrl;
    }

    export class AdminActionItemAddPageCtrl implements IAdminActionItemAddPageCtrl{
        $inject = ["$scope","$rootScope", "$q", "$state", "$filter","$location","$sce", "$timeout", "$window", "SpinnerService", "AdminActionService" ];
        status: [AIP.IStatus];
        folders: [AIP.IFolder];
        actionItemInfo: AIP.IActionItemParam|any;
        errorMessage:any;
        adminActionService:AIP.AdminActionService;
        spinnerService:AIP.SpinnerService;
        saving: boolean;
        $q: ng.IQService;
        $scope;
        $state;
        $rootScope;
        $filter;
        $location;
        $sce;
        actionItem1;
        editMode: boolean;
        existFolder: any;
        duplicateGroup: boolean;
        $timeout;
        actionItemInitial;
        actionItemDataChanged:boolean;
        redirectval;


        constructor($scope,  $rootScope, $q:ng.IQService, $state, $filter,$sce, $timeout, $window,
                    SpinnerService:AIP.SpinnerService, AdminActionService:AIP.AdminActionService,$location) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$sce = $sce;
            this.$state = $state;
            this.$rootScope=$rootScope;
            this.$location=$location;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.errorMessage = {};
            this.actionItem1={};
            this.editMode = false;
            this.existFolder = {};
            this.duplicateGroup = false;
            this.actionItemDataChanged=false;
            this.redirectval="NoData";

            this.actionItemInitial = {
                id: undefined,
                title: undefined,
                name: undefined,
                status: undefined,
                postedInd: undefined,
                folder: undefined,
                description: undefined
            }
            $window.onbeforeunload = (event)=> {
                //   if(this.isChanged()) {
                if(this.actionItemDataChanged) {
                    return this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                // reset to default event listener
                $window.onbeforeunload = null;
            };

            this.init();

        }


        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.actionItemInfo = <any>{};
            this.editMode = this.$state.params.isEdit==="true" ? true : false;
            allPromises.push(
                this.adminActionService.getStatus()
                    .then((response: AIP.IActionItemStatusResponse) => {
                        this.status = response.data;
                        this.status.map(item=>item.value=this.$filter("i18n_aip")(item.value));
                        this.actionItemInfo.status = this.status[0].value;
                    })
            );
            allPromises.push(
                this.adminActionService.getFolder()
                    .then((response:AIP.IActionItemFolderResponse) => {
                        this.folders = response.data;
                    })
            );
            this.$q.all(allPromises).then(() => {
                if (this.editMode) {
                    this.adminActionService.getActionItemDetail(this.$state.params.actionItemId)
                        .then((response:any) => {
                            if(response.data) {
                                this.actionItem1=response.data.actionItem;
                                this.actionItemInfo.id = parseInt(this.actionItem1.actionItemId);
                                this.actionItemInfo.title = this.actionItem1.actionItemTitle;
                                this.actionItemInfo.name = this.actionItem1.actionItemName;
                                this.actionItemInfo.status = this.actionItem1.actionItemStatus;
                                this.actionItemInfo.postedInd = this.actionItem1.postedInd==="Y";
                                this.actionItemInfo.folder = this.folders.filter((item)=> {
                                    return item.id === parseInt(this.actionItem1.folderId);
                                })[0];
                                /*this.existFolder = this.folders.filter((item)=> {
                                    return item.id === parseInt(this.actionItem1.folderId);
                                })[0];*/
                                this.actionItemInfo.description = this.actionItem1.actionItemDesc;
                                this.actionItemInitial = angular.copy(this.actionItemInfo);
                                this.trustActionItemContent();
                            } else {
                                //todo: output error in notification center?
                                console.log("fail");
                            }
                        }, (err) => {
                            //TODO:: handle error call
                            console.log(err);
                        })

                }
                this.spinnerService.showSpinner(false);
            });
            var that=this;
            this.$scope.$on("DetectChanges",function(event, args)
            {
                if (that.actionItemDataChanged) {
                    that.redirectval = args.state;
                    that.checkchangesDone();
                }

            });
        }
        selectGroupFolder(item, index) {
            if (this.editMode && (this.existFolder.id!==item.id)) {
                this.duplicateGroup = true;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.ok"), () => {
                    this.duplicateGroup = true;
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            } else {
                this.duplicateGroup = false;
            }
        }
        selectStatus(item, index) {
            this.actionItemInfo.status = item.value;
        }
        trustAsHtml = function (string) {
            return this.$sce.trustAsHtml(string);
        }

        trustActionItemContent = function () {
            this.actionItemInfo.description = this.$sce.trustAsHtml(this.$filter("html")(this.actionItemInfo.description)).toString();
            return this.actionItemInfo.description;
        }
        validateInput() {
            if(this.saving) {
                return false;
            }
            /*if(!this.actionItemInfo.name || this.actionItemInfo.name === null || this.actionItemInfo.name === "" || this.actionItemInfo.title.name > 300) {
                this.errorMessage.name = "invalid title";
            } else {
                delete this.errorMessage.name;
            }*/

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
            if(!this.actionItemInfo.title || this.actionItemInfo.title === null || this.actionItemInfo.title === "" || this.actionItemInfo.title.length > 300) {
                this.errorMessage.title = "invalid title";
            } else {
                delete this.errorMessage.title;
            }
            if(Object.keys(this.errorMessage).length>0) {
                return false;
            } else {
                return true;
            }
        }

        cancel()
        {
            this.redirectval="NoData";
            this.checkchangesDone();
        }

        checkchangesDone() {

            var that=this;
            while (notifications.length != 0) {
                notifications.remove(notifications.first())
            }
            if (that.actionItemDataChanged) {

                var n = new Notification({
                    message: this.$filter("i18n_aip")( "aip.admin.actionItem.saveChanges"),
                    type: "warning",
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    notifications.remove(n);

                })
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    that.actionItemDataChanged=false;
                    that.$rootScope.DataChanged=false;
                    if (that.redirectval==="NoData")
                    {
                        that.$state.go('admin-action-list');
                    }
                    else {
                        location.href = that.redirectval;
                    }
                    notifications.remove(n);
                })

                notifications.addNotification(n);
            }
            else
            {
                that.$state.go('admin-action-list');
            }

        }

        isChanged() {
            var changed = false;
            if(this.editMode) {
                var keys = Object.keys(this.actionItemInitial);
                for (var i = 0; i < keys.length; i++) {
                    if (this.actionItemInfo[keys[i]]) {
                        if (keys[i] === "folder") {
                            if (this.actionItemInfo.folder.id !== this.actionItemInitial.folder.id) {
                                changed = true;
                                break;
                            }
                        } else if (this.actionItemInfo[keys[i]] !== this.actionItemInitial[keys[i]]) {
                            changed = true;
                            break;
                        }
                    }
                }
            } else {
                if (this.actionItemInfo.name || this.actionItemInfo.title || (this.actionItemInfo.folder && this.actionItemInfo.folder.id) ||
                    this.actionItemInfo.description) {
                    changed = true;
                } else if (this.actionItemInfo.status!=="Draft") {
                    changed = true;
                }
            }
            return changed;
        }

        checkActionPost() {
            if(this.editMode) {
                this.adminActionService.checkActionItemPosted(this.actionItemInfo.id)
                    .then((response) => {
                        if (!this.actionItemInfo.actionItemPostedStatus && response.posted) {
                            var n = new Notification({
                                message: this.$filter("i18n_aip")("aip.admin.action.content.edit.posted.warning"),
                                type: "warning"
                            });
                            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), () => {
                                notifications.remove(n);
                                this.save()

                            });
                            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), () => {
                                notifications.remove(n);
                            });

                            notifications.addNotification(n);
                        } else {
                            this.save();
                        }

                    }, (err) => {
                        var n = new Notification({
                            message: this.$filter("i18n_aip")(err.message),
                            type: "error"
                        });
                        n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.ok"), () => {
                            notifications.remove(n);
                        });
                        notifications.addNotification(n);
                    });
            } else {
                this.save();
            }
        }

        dataChanged(this)
        {
            this.actionItemDataChanged=true;
            this.$rootScope.DataChanged=this.actionItemDataChanged
        }

        save() {
            this.saving = true;
            if (this.editMode) {
                this.adminActionService.editActionItems(this.actionItemInfo)
                    .then((response: AIP.IActionItemSaveResponse) => {
                        this.saving = false;

                        if (response.data.success) {

                            var notiParams = {};
                            notiParams = {
                                notiType: "editSuccess",
                                data: response.data
                            };
                            this.actionItemDataChanged=false;
                            this.$rootScope.DataChanged=false;
                            this.$state.go("admin-action-open", {
                                noti: notiParams,
                                data: response.data.updatedActionItem.id,
                            });

                        } else {
                            this.saveErrorCallback(response.data.message);
                        }
                    }, (err) => {
                        this.saving = false;
                        //TODO:: handle error call
                        console.log(err);
                    });
            }
            else {
                this.adminActionService.saveActionItem(this.actionItemInfo)
                    .then((response: AIP.IActionItemSaveResponse) => {
                        this.saving = false;
                        var notiParams = {};
                        if (response.data.success) {
                            notiParams = {
                                notiType: "saveSuccess",
                                data: response.data
                            };
                            this.$state.go("admin-action-open", {
                                noti: notiParams,
                                actionItemId: response.data.newActionItem.id
                            });
                        } else {
                            this.saveErrorCallback(response.data.message);
                        }
                    }, (err) => {
                        this.saving = false;
                        //TODO:: handle error call
                        console.log(err);
                    });
            }
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
