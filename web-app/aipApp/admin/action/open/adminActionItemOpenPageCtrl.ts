/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;
declare var CKEDITOR;

module AIP {
    interface IAdminActionItemOpenPageCtrl {

        specialCharacterTranslation():void;
    }
    export class AdminActionItemOpenPageCtrl {
        $inject = ["$scope","$rootScope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile", "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "AdminActionStatusService", "APP_ROOT", "CKEDITORCONFIG"];
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
        actionItem;
        actionItemPostedStatus;
        $scope;
        $rootScope;
        APP_ROOT;
        ckEditorConfig;
        templates;
        blocks;
        templateSelect: boolean;
        statuses;
        rules;
        selectedTemplate;
        saving;
        contentChanged;
        templateSource;
        allActionItems;
        originalAssign;
        test;
        personaData;
        actionFolder;
        actionItemDataChanged:boolean;
        redirectval;

        constructor($scope,$rootScope, $q: ng.IQService, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile,
                    $timeout, $interpolate, SpinnerService, AdminActionService, AdminActionStatusService, APP_ROOT, CKEDITORCONFIG) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$rootScope=$rootScope;
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
            this.actionItem = {};
            this.actionItemPostedStatus = {};
            this.templateSelect = false;
            this.templates = [];
            this.blocks = [];
            this.statuses = [];
            this.rules = [];
            this.allActionItems = [];
            this.originalAssign = [];
            this.selectedTemplate;
            this.actionFolder;
            this.templateSource;
            this.saving = false;
            this.contentChanged;
            this.test;
            this.personaData;
            this.actionItemDataChanged=false;
            this.redirectval="NoData";

            this.init();
            angular.element($window).bind('resize', function () {
                if (!$scope.$root.$phase) {
                    $scope.$apply();
                }
            });
            console.log(this.actionItemPostedStatus);
        };

        init() {
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.actionFolder = this.$state.params.actionItemId || this.$state.previousParams.actionItemId;
                this.openOverviewPanel();
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            promises.push(this.getStatus());
            promises.push(this.getRules());
            this.$q.all(promises).then(() => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner(false);
                this.contentChanged = false;
                this.specialCharacterTranslation();
            });
            var that=this;
            this.$scope.$on("DetectChanges",function(event, args)
            {
                if (that.actionItemDataChanged) {
                    that.redirectval = args.state;
                    that.checkEditchangesDone('content');
                }
            });
        }


        detectContentChange(content) {
            if (this.templateSelect) {
                this.contentChanged = true;
                this.dataChanged();
            }
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
            return {"min-height": containerHeight};
        }

        getSeparatorHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $(".xe-tab-nav").height() -
                $("#outerFooter").height() - 75;
            return {"min-height": containerHeight};
        }

        getTemplateContentHeight() {
            var containerHeight = $($(".xe-tab-container")[0]).height() -
                $(".xe-tab-nav").height();
            return {height: containerHeight};
        }

        openOverviewPanel() {
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemDetail(this.actionFolder)
                .then((response: AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    this.actionItem.actionItemContent = this.trustAsHtml(response.data.actionItem.actionItemContent);
                    this.selectedTemplate = this.actionItem.actionItemTemplateId;
                    this.actionItemPostedStatus = this.actionItem.actionItemPostedStatus;
                    console.log(this.actionItemPostedStatus);
                    if (this.templateSelect) {
                        this.selectTemplate();
                    }
                    deferred.resolve(this.openPanel("overview"));
                }, (err) => {
                    console.log(err);
                });
            return deferred.promise;
        }

        openContentPanel() {
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemTemplates()
                .then((response: AIP.IActionItemOpenResponse) => {
                    this.templates = response.data;
                    console.log(this.templates);
                    deferred.resolve(this.openPanel("content"));
                    this.getTemplateSource();
                    this.contentChanged = false;
                    if (this.templateSelect) {
                        this.selectTemplate();
                        this.selectTemplate();
                    }

                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }

        openBlockPanel() {
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemBlocks()
                .then((response) => {
                    this.blocks = response.data;
                    deferred.resolve(this.openPanel("block"));
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }

        openPanel(panelName) {
            var deferred = this.$q.defer();
            var url = "";
            switch (panelName) {
                case "overview":
                    url = this.APP_ROOT + "admin/action/open/overview/adminActionItemOpenOverview.html";
                    break;
                case "content":
                    url = this.APP_ROOT + "admin/action/open/content/adminActionItemOpenContent.html";
                    break;
                case "block":
                    url = this.APP_ROOT + "admin/action/open/block/adminActionItemBlock.html";
                    break;
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
                    if (panelName === "overview") {
                        if(this.actionItem.actionItemPostedStatus=="Y"){
                            $("#title-panel h1" ).html(this.actionItem.actionItemName+' ' + this.$filter("i18n_aip")("aip.admin.actionItem.title.posted"));
                        }
                        else {
                            $("#title-panel").children()[0].innerHTML = this.actionItem.actionItemName;
                        }
                    }
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }

        isNoTemplate() {
            if (this.templateSelect) {
                return false;
            } else {
                if (!this.actionItem.actionItemTemplateId) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        validateEdit(type) {
              console.log("Type val",type);
              console.log(this.actionItem.actionItemId);
                if(type === "overview") {
                    this.$state.go("admin-action-edit", {actionItemId: this.actionItem.actionItemId, isEdit: true});
                }
            }


        isNoContent() {
            if (this.templateSelect) {
                return false;
            } else {
                if (!this.actionItem.actionItemContent) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        specialCharacterTranslation()
        {
            for (var j=0;j<this.rules.length;j++)
            {
                if (this.rules[j].statusName.indexOf('&amp;') > -1 )
                {
                    this.rules[j].statusName=this.rules[j].statusName.replace("&amp;", "&");
                }
                if (this.rules[j].statusName.indexOf('&quot;') > -1 )
                {
                    this.rules[j].statusName= this.rules[j].statusName.replace("&quot;", "\"");

                }
                if ((this.rules[j].statusName.indexOf('&#039;') > -1)  || (this.rules[j].statusName.indexOf('&#39;') > -1 ))
                {
                    this.rules[j].statusName= this.rules[j].statusName.replace("&#039;", "\'");
                    this.rules[j].statusName= this.rules[j].statusName.replace("&#39;", "\'");
                }
                if (this.rules[j].statusName.indexOf('&lt;') > -1 )
                {
                    this.rules[j].statusName=  this.rules[j].statusName.replace("&lt;", "<");

                }
                if (this.rules[j].statusName.indexOf('&gt;') > -1 )
                {
                    this.rules[j].statusName=this.rules[j].statusName.replace("&gt;", ">");

                }
            }

        }


        isNoTemplateSelected() {
            if (this.templateSelect) {
                if (!this.selectedTemplate) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        getTemplateSource() {
            if (this.templates) {
                if (this.templates[0].sourceInd == 'B') {
                    this.templateSource = this.$filter("i18n_aip")("aip.common.baseline");
                }
                else {
                    this.templateSource = this.$filter("i18n_aip")("aip.common.local");
                }
            }
            return this.templateSource;
        }

        trustAsHtml = function (string) {
            return this.$sce.trustAsHtml(string);
        }

        trustActionItemContent = function () {
            this.actionItem.actionItemContent = this.$sce.trustAsHtml(this.actionItem.actionItemContent);
            return this.actionItem.actionItemContent;
        }

        trustActionItemRules = function (statusRuleLabelText) {
            this.rules.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(this.rules.statusRuleLabelText)).toString();
            return this.rules.statusRuleLabelText;
        }


        selectTemplate() {
            this.templateSelect = true;
            this.$timeout(() => {
                var actionItemTemplate: any = $("#actionItemTemplate");
                if (this.actionItem.actionItemTemplateId && actionItemTemplate) {

                    if ($("#actionItemTemplate > option:selected").val() !== this.actionItem.actionItemTemplateId.toString()) {
                        $("#actionItemTemplate > option:selected").remove();
                    }

                }
                $(".actionItemContent").height($(".actionItemElement").height() - $(".xe-tab-nav").height());
                //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                //action item selected temlate
                if (this.selectedTemplate) {
                    if (this.templates[0].sourceInd == "B") {
                    }
                }
            }, 500);
        }

        cancelContentEdit(option){
            var deferred = this.$q.defer();
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.actionFolder = this.$state.params.actionItemId || this.$state.previousParams.actionItemId;
            this.adminActionService.getActionItemDetail(this.actionFolder)
                .then((response: AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    this.selectedTemplate = this.actionItem.actionItemTemplateId;
                    this.trustActionItemContent();

                    switch (option) {
                        case "content":
                            this.templateSelect = false;
                            promises.push(this.getStatus());
                            promises.push(this.getRules());
                            this.$q.all(promises).then(() => {
                                //TODO:: turn off the spinner
                                this.spinnerService.showSpinner(false);
                                this.contentChanged = false;
                            });
                            break;
                        default:
                            break;
                    }
                    deferred.resolve(this.openPanel(option));
                }, (err) => {
                    console.log(err);
                });
            return deferred.promise;

        }

        dataChanged(this)
        {
            this.actionItemDataChanged=true;
            this.$rootScope.DataChanged=true;

        }
        reset(option)
        {
            var deferred = this.$q.defer();
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.actionFolder = this.$state.params.actionItemId || this.$state.previousParams.actionItemId;
            this.adminActionService.getActionItemDetail(this.actionFolder)
                .then((response: AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    this.selectedTemplate = this.actionItem.actionItemTemplateId;
                    this.trustActionItemContent();

                    switch (option) {
                        case "content":
                            this.templateSelect = false;
                            promises.push(this.getStatus());
                            promises.push(this.getRules());
                            this.$q.all(promises).then(() => {
                                //TODO:: turn off the spinner
                                this.spinnerService.showSpinner(false);
                                this.contentChanged = false;
                            });
                            break;
                        default:
                            break;
                    }
                    deferred.resolve(this.openPanel(option));
                }, (err) => {
                    console.log(err);
                });
            return deferred.promise;

        }


        cancel(option)
        {
            this.redirectval="NoData";
            this.checkEditchangesDone(option);
        }


        checkEditchangesDone(option) {

            var that=this;
            if (that.actionItemDataChanged || that.contentChanged) {

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
                    that.contentChanged=false;
                    if (that.redirectval==="NoData")
                    {
                        that.reset(option);
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
                that.reset(option);
            }
        }



        saveTemplate() {
            //TODO:: implement to save rules
            var allDefer = [];
            this.saving = true;
            if(this.actionItem.actionItemContent && $.type(this.actionItem.actionItemContent) != 'string'){
                this.actionItem.actionItemContent = this.$sce.getTrustedHtml(this.actionItem.actionItemContent)
            }
            allDefer.push(this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.actionItem.actionItemContent)
                .then((response: any) => {
                    if (response.data.success) {
                        return {success: true, type: "template", data: response.data.actionItem};
                    } else {
                        return {success: false, errors: response.data.errors};
                    }
                }, (err) => {
                    console.log(err);
                    return {success: false};
                }));
            // set seq order in rule array with it's index
            angular.forEach(this.rules, (item) => {
                item.statusRuleSeqOrder = this.rules.indexOf(item);
                item.statusId = item.statusId;
            });
            allDefer.push(this.adminActionService.updateActionItemStatusRule(this.rules, this.actionFolder)
                .then((response: any) => {
                    if (response.data.success) {
                        this.getRules();
                        return {success: true};
                    } else {
                        return {success: false, errors: response.data.errors};
                    }
                }, (err) => {
                    console.log(err);
                    return {success: false};
                }));

            this.$q.all(allDefer)
                .then((response: any) => {
                    this.saving = false;
                    var notiParams = {};
                    var errorItem = response.filter((item) => {
                        return item.success === false;
                    });
                    var newData = response.filter((item) => {
                        return item.type && item.type === "template";
                    });
                    if (errorItem.length === 0) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: newData[0].data
                        };
                        this.handleNotification(notiParams);
                        this.templateSelect = false;
                        this.actionItem = newData[0].data;
                        this.trustActionItemContent();
                        this.openContentPanel();
                    } else {
                        this.saveErrorCallback(response[0].error);
                        console.log("error:");
                    }
                }, (err) => {
                    this.saveErrorCallback(err);
                    console.log(err);
                    this.saving = false;
                });

            this.actionItemDataChanged=false;
            this.$rootScope.DataChanged=false;
        }

        getRules() {
            this.adminActionStatusService.getRules(this.actionFolder)
                .then((response) => {
                    this.rules = response.data;
                    console.log(this.rules);
                    angular.forEach(this.rules, (item) => {
                        //item.statusRuleLabelText = this.trustActionItemRules(item.statusRuleLabelText);
                        item.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(item.statusRuleLabelText)).toString();
                        item["status"] = {
                            actionItemStatus: item.statusName,
                            actionItemStatusId: item.statusId ? item.statusId : item.status.id
                        }

                    });
                    this.rules.sort((a, b) => {
                        return a.statusRuleSeqOrder - b.statusRuleSeqOrder;
                    });
                }, (err) => {
                    this.saveErrorCallback(err);
                    console.log("error:" + err);
                });
        }

        getStatus() {
            var deferred = this.$q.defer();
            this.adminActionStatusService.getRuleStatus()
                .then((response) => {
                    this.statuses = response.data;
                    angular.forEach(this.statuses, (item) => {
                        if (item.actionItemStatusActive == "N" || item.actionItemStatusDefault == 'Y') {
                            var index = this.statuses.indexOf(item);
                            this.statuses.splice(index, 1);
                                          }
                    });

                    deferred.resolve();
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }

        validateActionItemRule() {
            if (this.contentChanged)
            {
                this.dataChanged();

            }
            if (this.selectedTemplate && !this.saving) {
                if (this.rules.length === 0) {
                    return true;
                } else if (!this.contentChanged) {
                    return false
                } else {
                    var invalidRule = this.rules.filter((item) => {
                        var statusIdExists = true;

                        if (!item.status.id) {
                            statusIdExists = item.status.actionItemStatusId
                        }

                        return !item.statusRuleLabelText || item.statusRuleLabelText === "" || !statusIdExists
                    });

                    if (invalidRule.length === 0) {
                        return true;
                    }
                    return false;
                }
            }
            this.actionItemDataChanged=false;
            this.$rootScope.DataChanged=false;
            return false;
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
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
