/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
        checkchangesDone():void;
        dataChanged():void;
        groupInfoValues():void;

    }
    interface IGroupSelect {
        id?: number;
        title: string;
        name: string;
        status: any;
        folder: any;
        postedInd: boolean;
        description: string;
    }
    export class AdminGroupAddPageCtrl implements IAdminGroupAddPageCtrl{
        $inject = ["$scope","$rootScope", "$window", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$timeout", "CKEDITORCONFIG"];
        status: AIP.IStatus[];
        folders: AIP.IFolder[];
        groupInfo: IGroupSelect;
        groupInfoInitial: IGroupSelect;
        errorMessage;
        saving: boolean;
        adminGroupService: AIP.AdminGroupService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $scope;
        $state;
        $filter;
        $sce;
        $timeout;
        $rootScope;
        ckEditorConfig;
        editMode: boolean;
        existFolder: any;
        duplicateGroup: boolean;
        actionItemDataChanged:boolean;
        redirectval;
        statusList;
        selectedstatusval;
        groupval;
        constructor($scope,$rootScope, $window:ng.IWindowService, AdminGroupService:AIP.AdminGroupService,
                    $q:ng.IQService, SpinnerService, $state, $filter, $sce, $timeout, CKEDITORCONFIG) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$rootScope=$rootScope;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.$timeout = $timeout;
            this.ckEditorConfig = CKEDITORCONFIG
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.saving = false;
            this.errorMessage = {};
            this.errorMessage = {};
            this.editMode = false;
            this.existFolder = {};
            this.duplicateGroup = false;
            this.actionItemDataChanged=false;
            this.redirectval="NoData";
            this.groupval=[];
            this.statusList=[];
            this.selectedstatusval={};
            this.groupInfoInitial = {
                id: undefined,
                title: undefined,
                name: undefined,
                status: undefined,
                postedInd: undefined,
                folder: undefined,
                description: undefined
            };
            $scope.$watch(
                "[vm.status, vm.folders, vm.groupInfo.folder, vm.groupInfo.status, vm.groupInfo.description]", function(newVal, oldVal) {
                    if(!$scope.$$phase) {
                        $scope.apply();
                    }
                }, true);
            $window.onbeforeunload = (event)=> {
                if(this.isChanged()) {
                    return this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                // reset to default event listener
                $window.onbeforeunload = null;
            };
            this.init();
        }

        init() {
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupInfo = <any>{};
            this.editMode = this.$state.params.isEdit==="true"?true:false;
            promises.push(
                this.adminGroupService.getStatus().then((status) => {
                    for (var k = 0; k < status.length; k++) {
                    var values = {
                        "id": status[k].id,
                        "value": status[k].value
                    };
                        this.statusList.push(values);
                     }
                    this.status = status.map((item) => {
                        item.value = this.$filter("i18n_aip")( "aip.status." + item.value.charAt(0));
                        return item;
                    });
                    this.groupInfo.status = this.status[1].value;
                    this.selectedstatusval= this.status[1];
                })
            );
            promises.push(
                this.adminGroupService.getFolder().then((folders) => {
                    this.folders = folders;
                })
            );
            this.$q.all(promises).then(() => {
                if (this.editMode) {
                    this.adminGroupService.getGroupDetail(this.$state.params.groupId)
                        .then((response) => {
                            if(response.group) {
                                this.groupInfo.id = parseInt(response.group.groupId);
                                this.groupInfo.title = this.trustHTML(response.group.groupTitle);
                                this.groupInfo.name = this.trustHTML(response.group.groupName);
                                this.groupInfo.status = response.group.groupStatus;
                                this.groupInfo.postedInd = response.group.postedInd==="Y";
                                this.groupInfo.folder = this.folders.filter((item)=> {
                                    return item.id === parseInt(response.group.folderId);
                                })[0];
                                this.existFolder = this.folders.filter((item)=> {
                                    return item.id === parseInt(response.group.folderId);
                                })[0];

                                this.groupInfo.description = response.group.groupDesc;
                                this.groupInfoInitial = angular.copy(this.groupInfo);
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
        checkGroupPost() {
            if(this.editMode) {
                this.adminGroupService.groupPosted(this.groupInfo.id)
                    .then((response) => {
                        if (response.posted) {
                            var n = new Notification({
                                message: this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                                type: "warning"
                            });
                            if (this.existFolder.id !== this.groupInfo.folder.id) {
                                console.log("folder changed");
                                n.set("message", this.$filter("i18n_aip")("aip.admin.group.content.edit.folder.disable"));
                                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), () => {
                                    notifications.remove(n);
                                });
                            } else {
                                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), () => {
                                    notifications.remove(n);
                                });
                                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), () => {
                                    notifications.remove(n);
                                    this.save();
                                });
                            }
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

        groupInfoValues()
        {
            var modifiedStatus;
            if (this.editMode)
            {
                for (var k = 0; k < this.status.length; k++) {
                    if(this.status[k].value=== this.groupInfo.status)
                    {
                        this.selectedstatusval=this.status[k];
                    }
                }
            }
                for (var i = 0; i < this.statusList.length; i++) {
                    if (this.selectedstatusval.id === this.statusList[i].id) {
                        modifiedStatus = this.statusList[i].value;
                    }
                }

            var values = {
                "folder": this.groupInfo.folder,
                "id": this.groupInfo.id,
                "name":this.groupInfo.name,
                "postedInd":this.groupInfo.postedInd,
                "status":modifiedStatus,
                "title":this.groupInfo.title,
                "description":this.groupInfo.description
            };
            this.groupval.push(values);

         }


        save() {

            this.saving = true;
            this.groupInfoValues();
            this.adminGroupService.saveGroup(this.groupval[0], this.editMode, this.duplicateGroup)
                .then((response:IAddGroupResponse) => {
                    this.saving = false;
                    this.actionItemDataChanged=false;
                    this.$rootScope.DataChanged=false;

                    var notiParams = {};
                    if(response.success) {
                        notiParams = {
                            notiType: this.editMode ? "editSuccess" : "saveSuccess",
                            data: response.group.groupId
                        };
                        this.$state.go("admin-group-open", {noti: notiParams, groupId:response.group.groupId});
                    } else {
                        this.saveErrorCallback(response.invalidField, response.errors, response.message);
                    }
                }, (err) => {
                    this.saving = false;
                    var n = new Notification({
                        message: this.$filter("i18n_aip")(err.message),
                        type: "error"
                    });
                    n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.ok"), () => {
                        notifications.remove(n);
                    });
                    notifications.addNotification(n);
                });
        }

        dataChanged(this)
        {
            this.actionItemDataChanged=true;
            this.$rootScope.DataChanged=this.actionItemDataChanged;
        }

        cancel()
        {
            this.redirectval="NoData";
            this.checkchangesDone();
        }

        checkchangesDone() {

            var that=this;
            if (that.actionItemDataChanged) {

                var n = new Notification({
                    message: this.$filter("i18n_aip")( "aip.admin.actionItem.saveChanges"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    notifications.remove(n);

                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    that.actionItemDataChanged=false;
                    that.$rootScope.DataChanged=false;
                    if (that.redirectval==="NoData")
                    {
                        that.$state.go("admin-group-list");
                    }
                    else {
                        location.href = that.redirectval;
                    }
                    notifications.remove(n);
                });

                notifications.addNotification(n);
            }
            else
            {
                that.$state.go("admin-group-list");
            }

        }

        isChanged() {
            var changed = false;
            if(this.editMode) {
                var keys = Object.keys(this.groupInfoInitial);
                for (var i = 0; i < keys.length; i++) {
                    if (this.groupInfo[keys[i]]) {
                        if (keys[i] === "folder") {
                            if (this.groupInfo.folder.id !== this.groupInfoInitial.folder.id) {
                                changed = true;
                                break;
                            }
                        } else if (keys[i] === "description") {
                            var dom = document.createElement("DIV"), domInitial = document.createElement("DIV");
                            dom.innerHTML = CKEDITOR.instances.groupDesc.getSnapshot(), domInitial.innerHTML = this.groupInfoInitial[keys[i]];
                            var current = (dom.textContent || dom.innerHTML).replace(/\s\s/g, ""),
                                initial = (domInitial.textContent || domInitial.innerHTML).replace(/\s\s/g, "");
                            if (current.trim() !== initial.trim()) {
                                changed = true;
                                break;
                            }
                        } else if (this.groupInfo[keys[i]] !== this.groupInfoInitial[keys[i]]) {
                            changed = true;
                            break;
                        }
                    }
                }
            } else {
                if (this.groupInfo.name || this.groupInfo.title || (this.groupInfo.folder && this.groupInfo.folder.id) || this.groupInfo.description ) {
                    changed  = true;
                } else if (this.groupInfo.status!=="Draft") {
                    changed = true;
                }
            }
            return changed;
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
            this.selectedstatusval=item;
            this.groupInfo.status = item.value;
        }
        trustHTML = function(txtString) {
            var sanitized = txtString ? this.$filter("html")(this.$sce.trustAsHtml(txtString)):"";
            return sanitized;
        };

        saveErrorCallback(invalidFields, errors, orgMessage) {
            //todo: iterate through errors given back through contraints
            var message = this.$filter("i18n_aip")(orgMessage||"aip.admin.group.add.error.blank")
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
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.ok"), () => {
                notifications.remove(n);
            });
            notifications.addNotification(n);
        }
    }
}

angular.module("bannerAIP").controller("AdminGroupAddPageCtrl", AIP.AdminGroupAddPageCtrl);
