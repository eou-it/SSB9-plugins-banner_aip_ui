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
        $inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$templateRequest", "$templateCache",
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
        editMode;
        selected;
        allActionItems;
        originalAssign;
        saving:boolean;

        constructor($scope, AdminGroupService:AIP.AdminGroupService, $q:ng.IQService, SpinnerService, $state, $filter, $sce, $templateRequest, $templateCache,
                    $compile, $timeout, APP_ROOT) {
            $scope.vm = this;
            this.$scope = $scope;
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
            this.editMode = false;
            this.selected = [];
            this.allActionItems = [];
            this.originalAssign = [];
            this.saving = false;
            this.init();
        }

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];
            // this.openOverviewPanel();
            this.groupFolder = this.$state.params.data;
            //var groupDescHtml = this.$sce.trustAsHtml(this.$state.params.data.description);
            //console.log(groupDescHtml);
            //todo: replace this temporary workaround for sce not working for description
            $("p.openGroupDesc" ).html(this.$state.params.data.groupDesc);
            $("#title-panel h1" ).html(this.$state.params.data.groupName);

            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            this.$q.all( promises ).then( () => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner( false );
            } );
        }

        openPanel(panelName) {
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
                        $("#title-panel").children()[0].innerHTML = this.groupFolder.groupTitle;
                    }
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }

        openOverviewPanel() {
            this.editMode = false;
            this.selected = [];
            this.assignedActionItems = [];
            var deferred = this.$q.defer();
            this.adminGroupService.getGroupDetail(this.$state.params.data)
                .then((response) => {
                if(response.group) {
                    this.groupFolder = response.group;
                } else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
                deferred.resolve(this.openPanel("overview"));
            }, (err) => {
                //TODO:: handle error call
                console.log(err);
            });
            return deferred.promise;
        }
        openContentPanel() {
            this.editMode = false;
            this.assignedActionItems = [];
            this.allActionItems = [];
            var deferred = this.$q.defer();
            var promises = [];
            this.spinnerService.showSpinner( true );
            promises.push(
                this.adminGroupService.getAssignedActionItemInGroup(this.$state.params.data)
                    .then((response) => {
                        this.assignedActionItems = response;
                        this.assignedActionItems.sort((a,b) => {
                            return a.sequenceNumber - b.sequenceNumber;
                        });
                    }, (err) => {
                        this.assignedActionItems = [];
                        console.log(err);
                    })
            );
            promises.push(
                this.adminGroupService.getActionItemListForselect()
                    .then((response) => {
                    this.allActionItems = response;
                    this.allActionItems.sort((a,b) => {
                        if (a.folderName < b.folderName) {
                            return -1;
                        }
                        if (a.folderName > b.folderName ) {
                            return 1
                        }
                        return 0;
                    });
                    this.assignedActionItems.forEach((item) => {
                        this.selected[item.sequenceNumber-1] = this.allActionItems.filter((_item) => {
                            if (_item.actionItemId === item.actionItemId) {
                                _item.seq = item.sequenceNumber;
                                return _item;
                            }
                        })[0]
                    });
                    this.originalAssign =  angular.copy(this.selected);
                    }, (err) => {
                    console.log(err);
                    })
            );
            this.$q.all( promises ).then(() => {
                this.spinnerService.showSpinner( false );
                deferred.resolve(this.openPanel("content"));
            })
            return deferred.promise;
        }

        edit() {
            console.log("edit");
            this.editMode = true;
        }

        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                var data = noti.data.group[0];
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"),
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
        goUp(item, target) {
            var preItemIdx = this.assignedActionItems.indexOf(item) - 1;
            var preItem = this.assignedActionItems[preItemIdx];
            this.assignedActionItems[preItemIdx] = item;
            this.assignedActionItems[preItemIdx + 1] = preItem

            var preSelected = this.selected[preItemIdx];
            this.selected[preItemIdx] = this.selected[preItemIdx + 1];
            this.selected[preItemIdx + 1 ] = preSelected;

            this.reAssignSeqnumber();
        }
        goDown(item, target) {
            var nextItemIdx = this.assignedActionItems.indexOf(item) + 1;
            var nextItem = this.assignedActionItems[nextItemIdx];
            this.assignedActionItems[nextItemIdx] = item;
            this.assignedActionItems[nextItemIdx - 1] = nextItem

            var nextSelected = this.selected[nextItemIdx];
            this.selected[nextItemIdx] = this.selected[nextItemIdx - 1];
            this.selected[nextItemIdx - 1 ] = nextSelected ;

            this.reAssignSeqnumber();
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
            //TODO:: send this.selected, groupId to service
            // send().then show content preview page with success notification
            this.saving = true;
            this.adminGroupService.updateActionItemGroupAssignment(this.selected, this.$state.params.data)
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
    }

}

register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
