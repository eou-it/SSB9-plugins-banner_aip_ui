/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {
    interface IAdminGroupOpenPageCtrl {
        adminGroupService: AIP.AdminGroupService;
        groupStatus: IStatus;
        groupInfo: IGroupInfo;
        groupFolder: IGroupFolder;
    }
    export class AdminGroupOpenPageCtrl implements IAdminGroupOpenPageCtrl{
        $inject = ["$scope", "$window", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$templateRequest", "$templateCache",
            "$compile", "$timeout", "APP_ROOT"];
        groupInfo:IGroupInfo;
        groupFolder: IGroupFolder;
        groupStatus: IStatus;
        adminGroupService: AIP.AdminGroupService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        $sce;
        $templateRequest;
        $templateCache;
        $compile;
        $timeout;
        $scope;
        APP_ROOT;
        assignedActionItems;
        initialAssigned;
        editMode;
        selected;
        allActionItems;
        originalAssign;
        saving:boolean;
        groupDetailDefer:ng.IPromise<any>;
        $window;


        constructor($scope, $window, AdminGroupService:AIP.AdminGroupService, $q:ng.IQService, SpinnerService, $state, $filter, $sce, $templateRequest, $templateCache,
                    $compile, $timeout, APP_ROOT) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$window = $window;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.$templateRequest = $templateRequest;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.APP_ROOT = APP_ROOT;
            this.assignedActionItems = [];
            this.initialAssigned = [];
            this.editMode = false;
            this.selected = [];
            this.allActionItems = [];
            this.originalAssign = [];
            this.saving = false;
            this.groupDetailDefer = null;

            this.init();
        }

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];
            this.groupDetailDefer = this.getGroupDetailDefer(this.$state.params.groupId).then(()=> {
                // $("p.openGroupDesc" ).html(decodeURI(this.groupFolder.groupDesc));
                if(this.groupFolder.postedInd=="Y"){
                    $("#title-panel h1" ).html(this.groupFolder.groupName+this.$filter("i18n_aip")("aip.admin.group.title.posted"));
                }else{
                $("#title-panel h1" ).html(this.groupFolder.groupName);
                }

            }, (err) => {
                console.log(err);
            })
            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            this.$q.all( promises ).then( () => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner( false );
            } );
        }

        openPanel(panelName) {
            this.$window.onbeforeunload = null;
            var deferred=this.$q.defer();
            var url = "";
            switch (panelName) {
                case "overview":
                    url = this.APP_ROOT + "admin/group/open/overview/overview.html";
                    break;
                case "content":
                    url = this.APP_ROOT + "admin/group/open/content/content.html";
                    break;
                case "edit":
                    url = this.APP_ROOT + "admin/group/open/edit/edit.html";
                default:
                    break;
            }
            var newScope = this.$scope.$new(true); // isolate scope
            newScope.vm = this.$scope.vm;
            var templateUrl = this.$sce.getTrustedResourceUrl(url);
            this.$templateRequest(templateUrl)
                .then((template) => {
                    var compiled = this.$compile(template)(newScope);
                    deferred.resolve(compiled);
                    if(panelName === "overview") {
                        if(this.groupFolder.postedInd=="Y"){
                            $("#title-panel h1" ).html(this.groupFolder.groupName+this.$filter("i18n_aip")("aip.admin.group.title.posted"));
                        }
                        else {
                            $("#title-panel").children()[0].innerHTML = this.groupFolder.groupTitle;
                        }
                    }
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }
        getGroupDetailDefer(id) {
            var request = this.adminGroupService.getGroupDetail(id)
                .then((response) => {
                    if(response.group) {
                        this.groupFolder = response.group;
                    } else {
                        //todo: output error in notification center?
                        console.log("fail");
                    }
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
            return request;
        }

        openOverviewPanel() {
            this.editMode = false;
            this.selected = [];
            this.assignedActionItems = [];
            this.initialAssigned = [];
            var deferred = this.$q.defer();
            this.groupDetailDefer.then((group) => {
                 deferred.resolve( this.openPanel("overview") );
            });
            return deferred.promise;

        }
        openContentPanel() {
            this.editMode = false;
            this.assignedActionItems = [];
            this.initialAssigned = [];
            this.allActionItems = [];
            this.selected = [];
            var deferred = this.$q.defer();
            var promises = [];
            this.spinnerService.showSpinner( true );
            promises.push(this.groupDetailDefer);
            promises.push(
                this.adminGroupService.getAssignedActionItemInGroup(this.groupFolder.groupId?this.groupFolder.groupId:this.groupFolder)
                    .then((response) => {
                        this.assignedActionItems = response;
                        this.assignedActionItems.sort((a,b) => {
                            return a.sequenceNumber - b.sequenceNumber;
                        });
                    }, (err) => {
                        this.assignedActionItems = [];
                        this.initialAssigned = [];
                        console.log(err);
                    })
            );
            this.$q.all( promises ).then(() => {
                this.spinnerService.showSpinner( false );
                deferred.resolve(this.openPanel("content"));
            })
            return deferred.promise;
        }

        trustHTML = function(txtString) {
            var sanitized = txtString ? this.$filter("html")(this.$sce.trustAsHtml(txtString)):"";
            return sanitized;
        }

        edit() {
            this.adminGroupService.getActionItemListForselect()
                .then((response) => {
                    this.allActionItems = response;
                    this.assignedActionItems.forEach((item) => {
                        this.selected[item.sequenceNumber - 1] = this.allActionItems.filter((_item) => {
                            if (_item.actionItemId === item.actionItemId) {
                                _item.seq = item.sequenceNumber;
                                return _item;
                            }
                        })[0]
                    });
                    this.originalAssign = angular.copy(this.selected);
                    this.initialAssigned = angular.copy(this.assignedActionItems);
                    this.editMode = true;
                    this.$window.onbeforeunload = (event)=> {
                        if (this.isChanged()) {
                            // reset to default event listener
                            return this.$filter("i18n_aip")("aip.common.admin.unsaved");
                        }
                        // reset to default event listener
                        this.$window.onbeforeunload = null;
                    };
                }, (err) => {
                    console.log(err);
                });

        }

        isChanged() {
            var changed = false;
            if(this.assignedActionItems.length !== this.initialAssigned.length) {
                return true;
            }
            for (var i = 0; i < this.assignedActionItems.length; i++) {
                var item = this.assignedActionItems[i];
                var initial = this.initialAssigned.filter((_item) => {
                    return _item.id === item.id;
                });
                if (initial.length === 0 ||
                    ((item.actionItemId !== initial[0].actionItemId) || (item.sequenceNumber !== initial[0].sequenceNumber))) {
                    changed = true;
                    break;
                }
            }
            return changed;
        }

        validateEdit(type) {
            this.adminGroupService.groupPosted(this.groupFolder.groupId)
                .then((response) => {
                    // if(response.posted) {
                    //     var n = new Notification({
                    //         message: this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                    //         type: "warning"
                    //     });
                    //     n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), () => {
                    //         notifications.remove(n);
                    //     });
                    //     n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), ()=> {
                    //         notifications.remove(n);
                    //         if(type === "overview") {
                    //             this.$state.go("admin-group-edit", {groupId:this.groupFolder.groupId, isEdit: true});
                    //         } else {
                    //             this.edit();
                    //         }
                    //     });
                    //     notifications.addNotification(n);
                    // } else {
                    //     notifications.remove(n);
                        if(type === "overview") {
                            this.$state.go("admin-group-edit", {groupId:this.groupFolder.groupId, isEdit: true});
                        } else {
                            this.edit();
                        }
                    // }
                }, (err) => {
                    throw new Error(err);
                });
        }

        handleNotification(noti) {
            if(noti.notiType === "saveSuccess" || noti.notiType === "editSuccess") {
                var message = "";
                if (noti.notiType === "saveSuccess") {
                    message = this.$filter("i18n_aip")("aip.common.save.successful");
                } else if (noti.notiType === "editSuccess") {
                    message = this.$filter("i18n_aip")("aip.common.edit.successful");
                }
                var n = new Notification({
                    message: message,
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".groupAddContainer").focus();
                }, 500);
            }
        }
        groupFn(item) {
            return item.folderName;
        }
        goUp(item, evt) {
            var preItemIdx = this.assignedActionItems.indexOf(item) - 1;
            var preItem = this.assignedActionItems[preItemIdx];
            this.assignedActionItems[preItemIdx] = item;
            this.assignedActionItems[preItemIdx + 1] = preItem

            var preSelected = this.selected[preItemIdx];
            this.selected[preItemIdx] = this.selected[preItemIdx + 1];
            this.selected[preItemIdx + 1 ] = preSelected;
            this.reAssignSeqnumber();
            if(preItemIdx  > 0 ) {
                this.$timeout(() => {
                    evt.currentTarget.focus();
                }, 0);
            } else if(preItemIdx === 0) {
                this.$timeout(() => {
                    evt.target.nextElementSibling.focus();
                }, 0);
            }
        }
        goDown(item, evt) {
            var nextItemIdx = this.assignedActionItems.indexOf(item) + 1;
            if(nextItemIdx  === this.selected.length) {
                return;
            }

            var nextItem = this.assignedActionItems[nextItemIdx];
            this.assignedActionItems[nextItemIdx] = item;
            this.assignedActionItems[nextItemIdx - 1] = nextItem

            var nextSelected = this.selected[nextItemIdx];
            this.selected[nextItemIdx] = this.selected[nextItemIdx - 1];
            this.selected[nextItemIdx - 1 ] = nextSelected ;
            this.reAssignSeqnumber();
            if(nextItemIdx + 1  < this.selected.length) {
                this.$timeout(() => {
                    evt.currentTarget.focus();
                }, 0);
            } else if (nextItemIdx + 1 === this.selected.length) {
                this.$timeout(() => {
                    evt.target.previousElementSibling.focus();
                }, 0);
            }
        }
        reAssignSeqnumber() {
            this.selected.map((item, index) => {
                item.seq = index + 1;
                return item;
            });
            this.assignedActionItems.map((item, index) => {
                item.sequenceNumber = index + 1;
                return item;
            });
        }
        delete(item) {
            var itemIdx = this.assignedActionItems.indexOf(item);
            this.assignedActionItems.splice(itemIdx, 1);
            this.selected.splice(itemIdx, 1);
            this.reAssignSeqnumber();
        }
        addNew() {
            this.assignedActionItems.push({});
            this.selected.push({});
        }
        selectActionItem(item, index) {
            var currentAssigned = this.assignedActionItems[index];
            if (currentAssigned.actionItemId === item.actionItemId) {
                return;
            }
            if (!currentAssigned.actionItemId) {
                currentAssigned.sequenceNumber = index + 1;
            }
            currentAssigned.actionItemId = item.actionItemId;
            currentAssigned.actionItemFolderName = item.folderName;
            currentAssigned.actionItemName = item.actionItemName;
            currentAssigned.actionItemStatus = item.actionItemStatus;
            this.assignedActionItems[index] = currentAssigned;
            if(!this.selected[index].actionItemId) {
                item.seq = index + 1;
                this.selected[index] = item;
            }
            this.selected = this.selected.filter((item, idx) => {
                return true;
            });
            this.reAssignSeqnumber()
        }
        selectFilter(item,index,all) {
            var exist = this.assignedActionItems.filter((_item) => {
                return item.actionItemId === _item.actionItemId;
            });
            if (exist.length > 0) {
                return false;
            }
            return true;
        }
        validateInput() {
            var validation = true;
            var unassigned = this.selected.filter((item) => {
                return !item.actionItemId;
            });

            if (this.isEqual(this.selected, this.originalAssign)) {
                validation = false;
            }
            if (unassigned.length!==0) {
                validation = false;
            }
            return validation;
        }
        validateAddInput() {
            var notSelected = this.selected.filter((item) => {
                return !item.actionItemId;
            });
            if (notSelected.length===0 && this.allActionItems.length!==this.selected.length && !this.saving) {
                return true;
            }
            return false;
        }
        cancel() {
            this.editMode = false;
            this.saving = false;
            this.openContentPanel()
        }
        isEqual(item1, item2) {
            var item1Properties = item1.map((item) => {
                return [item.actionItemId, item.folderId, item.seq];
            });
            var item2Properties = item2.map((item) => {
                return [item.actionItemId, item.folderId, item.seq];
            })

            if ( angular.equals(item1Properties, item2Properties)) {
                return true;
            }
            return false;
        }
        save() {
            this.saving = true;
            this.adminGroupService.updateActionItemGroupAssignment(this.selected, this.groupFolder.groupId?this.groupFolder.groupId:this.groupFolder)
                .then((response) => {
                    this.saving = false;
                    console.log(response);
                    var n = new Notification({
                        message: this.$filter("i18n_aip")("aip.admin.group.assign.success"),
                        type: "success",
                        flash: true
                    });
                    setTimeout(() => {
                        notifications.addNotification(n);
                        this.openContentPanel();
                    }, 500);
                }, (err) => {
                    this.saving = false;
                    console.log(err);
                    var n = new Notification({
                        message: this.$filter("i18n_aip")("aip.admin.group.assign.fail"),
                        type: "warning"
                  });
                    setTimeout(() => {
                        notifications.addNotification(n);
                        this.openContentPanel();
                    }, 500);
                });
        }
        validateSave() {
            this.adminGroupService.getGroupDetail(this.groupFolder.groupId?this.groupFolder.groupId:this.groupFolder)
                .then((response) => {
                    if(response.group) {
                        this.groupFolder = response.group;
                        if(this.groupFolder.postedInd === "Y") {
                            var n = new Notification({
                                message: this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                                type: "warning"
                            });
                            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), () => {
                                notifications.remove(n);
                            });
                            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), ()=> {
                                notifications.remove(n);
                                this.save();
                            });
                            notifications.addNotification(n);
                        } else {
                            this.save();
                        }
                    } else {
                        //todo: output error in notification center?
                        console.log("fail");
                    }
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
        }
    }

}

register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
