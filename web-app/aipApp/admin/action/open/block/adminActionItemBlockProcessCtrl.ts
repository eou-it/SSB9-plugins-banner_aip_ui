/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
        addBlockProcessData;
        persona;
        personaData;
        process;
        globalBlockProcess: boolean;
        assignedActionItems;
        initialAssigned;
        allActionItems;
        selected;
        originalAssign;

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
            this.addBlockProcessData;
            this.process;
            this.personaData;
            this.assignedActionItems = [];
            this.initialAssigned = [];
            this.allActionItems = [];
            this.globalBlockProcess=false;

            this.blockedProcess = [];
            this.allBlockProcessList = [];
            console.log
            this.alreadyGenerated = [];
            this.selected = [];
            this.originalAssign = [];

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
            promises.push(this.getBlockedProcessList(this.$state.params.actionItemId));
            /*  promises.push(this.getBlockedProcessList());*/
            //if needed, add more deferred job into promises list
            this.$q.all( promises ).then( () => {
                this.spinnerService.showSpinner( false );
            } );
            promises.push(

            )}



        getBlockedProcessList(actionItemId?) {
            var deferred = this.$q.defer();
            this.adminActionService.getBlockedProcess(actionItemId)
                .then((response:any) => {
                    if(response.data) {
                        if (actionItemId) {
                            this.blockedProcess = <any[]>response.data.blockedProcess || response.data;
                            this.globalBlockProcess=response.data.globalBlockProcess;
                            this.allBlockProcessList=response.data;
                            console.log( this.blockedProcess);
                        } else {
                            this.allBlockProcessList = <any[]>response.data.blockedProcess;
                            console.log( this.blockedProcess);
                        }

                    } else {
                        console.log( this.blockedProcess);
                        this.blockedProcess = []
                    }
                    deferred.resolve(response.data.blockedProcess);
                }, (error) => {
                    console.log(error);
                    deferred.reject(error);
                });
            return deferred.promise;
        }



        enterEditMode() {
            this.adminActionService.loadBlockingProcessLov1().then((response:any) => {
                this.allActionItems = response.data;
                console.log(this.allActionItems)
                var that = this;
                this.personaData=[];

                angular.forEach(this.allActionItems.persona, (value,key) => {
                    {
                        this.personaData.push(key);
                    }

                })

                if(this.blockedProcess.length!==0){
                    this.editMode=true;
                    console.log(this.allBlockProcessList)
                    var editBlockData=[];
                    var name;
                    var persona;
                    var urls;
                    var id;
                    this.globalBlockProcess;
                    console.log(this.globalBlockProcess)

                    angular.forEach(this.blockedProcess,(key) => {
                        console.log(this.blockedProcess)


                        {
                            editBlockData.push ({process:{id:key.id.blockingProcessId,name: key.processName,urls: key.urls,personAllowed:key.processPersonaBlockAllowedInd}, persona: key.blockedProcessAppRole})
                        }

                    })
                    this.selected=editBlockData;
                    console.log(this.selected)
                    //this.originalAssign = angular.copy(this.selected);

                }
                else {
                    this.editMode=true;
                    this.addNew();

                }
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

            this.selected.push({});
        }
        validateAddInput() {
            var notSelected = this.selected.filter((item) => {
                if(item.process && item.process.personAllowed=="Y"){
                    return !item.persona;
                }
                return !item.process;
            });

            if (notSelected.length===0 && !this.isSaving) {
                return false;
            }
            return true;
        }
        validateActionBlockProcess() {
            var validation = true;
            var unassigned = this.selected.filter((item) => {
                if(item.process && item.process.personAllowed !=="N" ){
                    return !item.persona;
                }
                return !item.process;
            });



                if (this.originalAssign.length>0 && this.isEqual(this.selected, this.originalAssign)) {
                    validation = false;
                }
                if (unassigned.length !== 0) {
                    validation = false;
                }
                return validation;

        }

        /*selectActionItem(item, index) {
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
        }*/



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
                    message: this.$filter("i18n_aip")("aip.common.save.successful"), //+
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
            else if(noti.notiType === "saveFailed"){
                var n1 = new Notification({
                    message: noti.data, //+
                    type: "error",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n1);
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


        cancel() {
            //reset selected items then exit edit mode
            this.getBlockedProcessList(this.$state.params.actionItemId)
                .then((response) => {
                    this.alreadyGenerated = [];
                    this.editMode = true;
                }, (error) => {
                    console.log("something wrong");
                    this.alreadyGenerated = [];
                    this.editMode = true;
                });
        }

        isEqual(item1, item2) {
            var item1Properties = item1.map((item) => {
                return [item.process.name, item.persona];
            });
            var item2Properties = item2.map((item) => {
                return [item.process.name, item.persona];
            })

            if ( angular.equals(item1Properties, item2Properties)) {
                return true;
            }
            return false;
        }

        saveSucess(){
            var saveData = this.selected.map((item)=>
            {
                return {processId:item.process.id, persona: item.persona};
            });
            this.adminActionService.updateBlockedProcessItems(this.$state.params.actionItemId,this.globalBlockProcess,saveData)
                .then((response) => {
                    this.getBlockedProcessList(this.$state.params.actionItemId);


                    if(response.data.success){
                        var notiParams = {};

                        notiParams = {
                            notiType: "saveSuccess",
                            noti: notiParams,
                            data: response.data.success
                        };
                        this.handleNotification( notiParams);

                    }
                    if(response.data.success){
                        var notiParams = {};

                        notiParams = {
                            notiType: "saveSuccess",
                            noti: notiParams,
                            data: response.data.success
                        };
                        this.handleNotification( notiParams);

                    }
                    else{
                        var notiParams = {};

                        notiParams = {
                            notiType: "saveFailed",
                            noti: notiParams,
                            data: response.data.message
                        };
                        this.handleNotification( notiParams);
                        this.editMode = true;
                    }

                    this.isSaving = false;
                }, (error) => {
                    this.isSaving = false;
                });
            this.editMode = false;
        }

        saveBlocks() {
            var that=this;
            //save selected items then exit edit mode
            //this.editMode = false;
            this.isSaving = true;
            // items: this.alreadyGenerated[{id:id, name: "name", value:{processNamei18n:"i18n", urls:["url"]}}]
            // actionItemId: this.$state.params.data


            this.adminActionService.checkActionItemPosted(this.$state.params.actionItemId)
                .then((response) => {
                    if (response.posted) {
                        var n = new Notification({
                            message: this.$filter("i18n_aip")("aip.admin.action.content.edit.posted.warning"),
                            type: "warning"
                        });
                        n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), () => {

                            notifications.remove(n);
                            this.saveSucess()


                        });
                        n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), () => {
                            notifications.remove(n);
                            this.editMode = true;
                        });

                        notifications.addNotification(n);
                    }

                    else{
                        this.saveSucess()
                    }
                })



        }
    }
}

register("bannerAIP").controller("AdminActionItemBlockCtrl", AIP.AdminActionItemBlockCtrl);
