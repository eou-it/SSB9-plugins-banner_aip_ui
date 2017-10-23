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
            this.selected = {};
            this.allActionItems = [];
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
            var deferred = this.$q.defer();
            var promises = [];
            this.spinnerService.showSpinner( true );
            promises.push(
                this.adminGroupService.getAssignedActionItemInGroup(this.$state.params.data)
                    .then((response) => {
                        this.assignedActionItems = response;
                    }, (err) => {
                        this.assignedActionItems = [];
                        console.log(err);
                    })
            );
            promises.push(
                this.adminGroupService.getActionItemListForselect()
                    .then((response) => {
                    this.allActionItems = response;
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
        groupFn() {
            return true;
        }
        cancel() {

        }
        save() {

        }
        addNew() {

        }
        delete(item) {

        }
        goUp(item) {

        }
        goDown(item) {

        }
    }

}

register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
