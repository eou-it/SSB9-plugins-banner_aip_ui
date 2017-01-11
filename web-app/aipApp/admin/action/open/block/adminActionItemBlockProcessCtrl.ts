///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
///<reference path="../../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;
declare var CKEDITOR;

module AIP {

    export class AdminActionItemBlockCtrl{
        $inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
            "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "AdminActionStatusService", "APP_ROOT", "CKEDITORCONFIG"];
        adminActionService: AIP.AdminActionService;
        adminActionStatusService: AIP.AdminActionStatusService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        $sce;
        $window;
        $templateRequest;
        $templateCache;
        $compile;
        $timeout;
        $interpolate;
        $scope;
        APP_ROOT;
        ckEditorConfig;

        blockedProcess: any[];
        allBlockProcessList: any[];
        alreadyGenerated: any[];
        editMode: boolean;
        isSaving: boolean;

        constructor($scope, $q:ng.IQService, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile,
                    $timeout, $interpolate, SpinnerService, AdminActionService, AdminActionStatusService, APP_ROOT, CKEDITORCONFIG) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.$window = $window;
            this.$templateRequest = $templateRequest;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.$interpolate = $interpolate;
            this.adminActionService = AdminActionService;
            this.adminActionStatusService = AdminActionStatusService;
            this.spinnerService = SpinnerService;
            this.APP_ROOT = APP_ROOT;
            this.ckEditorConfig = CKEDITORCONFIG;

            this.blockedProcess = [];
            this.allBlockProcessList = [];
            this.alreadyGenerated = [];

            this.editMode = false;
            this.isSaving = false;

            this.init();
            angular.element( $window ).bind( 'resize', function () {
                if (!$scope.$root.$$phase) {
                    $scope.$apply();
                }
            } );
        };

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];
            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            promises.push(this.getBlockedProcessList(this.$state.params.data));
            promises.push(this.getBlockedProcessList());
            //if needed, add more deferred job into promises list
            this.$q.all( promises ).then( () => {
                this.spinnerService.showSpinner( false );
            } );
        }
        getBlockedProcessList(actionItemId?) {
            var deferred = this.$q.defer();
            this.adminActionService.getBlockedProcess(actionItemId)
                .then((response:any) => {
                    if(response.data.success) {
                        if (actionItemId) {
                            this.blockedProcess = <any[]>response.data.blockedProcesses;
                        } else {
                            this.allBlockProcessList = <any[]>response.data.blockedProcesses;
                        }
                    } else {
                        console.log(response.data.message);
                        this.blockedProcess = []
                    }
                    deferred.resolve(response.data.blockedProcesses);
                }, (error) => {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        addNewItem() {
            var available = this.getAvailable();
            if(available.length > 0) {
                this.blockedProcess.push(available[0]);
            }
        }

        getAvailable() {
            return this.allBlockProcessList.filter((item) => {
                var blocked = this.blockedProcess.filter((_item) => {
                    return _item.name === item.name;
                });
                var generated = this.alreadyGenerated.filter((_item) => {
                    return _item.name === item.name;
                });
                if (blocked.length === 0 && generated.length === 0) {
                    return item;
                }
            });
        }
        isEmpty(obj) {
            if (Object.keys(obj).length===0) {
                return true;
            } else {
                return false;
            }
        }
        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                // var data = noti.data.newActionItem||noti.data.actionItem;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.action.add.success"), //+
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
        }

        getHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() +
                $(".status-rules").height() + 250
            // $("#outerFooter").height() - 30;
            return {"min-height": containerHeight};
        }
        getTemplateContentHeight() {
            var containerHeight = $($(".xe-tab-container")[0]).height() -
                $(".xe-tab-nav").height();
            return {height: containerHeight};
        }

        trustAsHtml = function(string) {
            return this.$sce.trustAsHtml(string);
        }

        trustActionItemContent = function() {
            this.actionItem.actionItemContent = this.$sce.trustAsHtml(this.$filter("html")(this.actionItem.actionItemContent)).toString();
            return this.actionItem.actionItemContent;
        }

        trustActionItemRules = function(statusRuleLabelText) {
            this.rules.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(this.rules.statusRuleLabelText)).toString();
            return this.rules.statusRuleLabelText;
        }

        enterEditMode() {
            this.editMode = true;
        }
        cancel() {
            //reset selected items then exit edit mode
            this.getBlockedProcessList(this.$state.params.data)
                .then((response) => {
                    this.alreadyGenerated = [];
                    this.editMode = false;
                }, (error) => {
                    console.log("something wrong");
                    this.alreadyGenerated = [];
                    this.editMode = false;
                });
        }

        validateActionBlockProcess() {
            if (this.alreadyGenerated.length === 0 || this.isSaving ) {
                return false;
            }
            return true;
        }
        saveBlocks() {
            //save selected items then exit edit mode
            this.editMode = false;
            this.isSaving = true;
            // items: this.alreadyGenerated[{id:id, name: "name", value:{processNamei18n:"i18n", urls:["url"]}}]
            // actionItemId: this.$state.params.data
            this.adminActionService.updateBlockedProcessItems(this.$state.params.data, this.alreadyGenerated)
                .then((response) => {
                    this.isSaving = false;
                }, (error) => {
                    this.isSaving = false;
                });
        }
    }
}

register("bannerAIP").controller("AdminActionItemBlockCtrl", AIP.AdminActionItemBlockCtrl);
