///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;
declare var CKEDITOR;

module AIP {

    export class AdminActionItemOpenPageCtrl{
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
        actionItem;
        $scope;
        APP_ROOT;
        ckEditorConfig;
        templates;
        blocks;
        templateSelect: boolean;
        statuses;
        rules;
        selectedTemplate;
        saving;
        templateSource;

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
            this.actionItem = {};
            this.templateSelect = false;
            this.templates = [];
            this.blocks = [];
            this.statuses = [];
            this.rules = [];
            this.selectedTemplate;
            this.templateSource;
            this.saving = false;
            this.init();
            angular.element( $window ).bind( 'resize', function () {
                // $scope.onResize();
                if (!$scope.$root.$phase) {
                    $scope.$apply();
                }
                // $scope.$evalAsync(() => {
                //     $scope.$apply();
                // });
            } );
        };

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];

            this.openOverviewPanel();
            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            promises.push(this.getStatus());
            promises.push(this.getRules());
            this.$q.all( promises ).then( () => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner( false );
            } );
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
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then((response:AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    this.selectedTemplate = this.actionItem.actionItemTemplateId;
                    if (this.templateSelect) {
                        this.trustActionItemContent();
                        this.selectTemplate();
                    } else {
                        this.trustActionItemContent();
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
                .then((response) => {
                    this.templates = response.data;
                    deferred.resolve(this.openPanel("content"));
                    this.getTemplateSource();

                    if (this.templateSelect) {
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
            var deferred=this.$q.defer();
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
                    if(panelName === "overview") {
                        $("#title-panel").children()[0].innerHTML = this.actionItem.actionItemName;
                    }
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }
        isNoTemplate() {
            if(this.templateSelect) {
                return false;
            } else {
                if (!this.actionItem.actionItemTemplateId) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        isNoContent() {
            if(this.templateSelect) {
                return false;
            } else {
                if (!this.actionItem.actionItemContent) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        isNoTemplateSelected() {
            if(this.templateSelect) {
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
                else  {
                    this.templateSource = this.$filter("i18n_aip")("aip.common.local");
                }
            }
            return this.templateSource;
        }

        trustAsHtml = function(string) {
            return this.$sce.trustAsHtml(string);
        }

        trustActionItemContent = function(actionItemContent) {
            this.actionItem.actionItemContent = (this.actionItem.actionItemContent);
            return this.actionItem.actionItemContent;
        }

        trustActionItemRules = function(statusRuleLabelText) {
            this.rules.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(this.rules.statusRuleLabelText)).toString();
            return this.rules.statusRuleLabelText;
        }


        selectTemplate() {
            this.templateSelect = true;
            this.$timeout(() => {
                var actionItemTemplate:any = $("#actionItemTemplate");
                if (this.actionItem.actionItemTemplateId && actionItemTemplate ) {

                    if ( $("#actionItemTemplate > option:selected" ).val() !== this.actionItem.actionItemTemplateId.toString() ) {
                        $("#actionItemTemplate > option:selected").remove();
                    }

                }
                /*
                if(actionItemTemplate) {
                    actionItemTemplate.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity,
                        placeholderOption:'first'
                    });
                }*/
                $(".actionItemContent").height($(".actionItemElement").height() - $(".xe-tab-nav").height());
                //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                //action item selected temlate
                if (this.selectedTemplate) {
                    if (this.templates[0].sourceInd == "B") {
                        /*
                        $(".select2-container.actionItemSelect .select2-chosen")[0].innerHTML = this.actionItem.actionItemTemplateName + " (" + this.$filter("i18n_aip")("aip.common.baseline") + ")";
                        */
                    }
                }
            }, 500);
        }
        cancel(option) {
            this.init();
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then((response:AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    this.selectedTemplate = this.actionItem.actionItemTemplateId;
                    this.trustActionItemContent();

                    switch(option) {
                        case "content":
                            this.templateSelect = false;
                            break;
                        default:
                            break;
                    }
                    deferred.resolve(this.openPanel("overview"));
                }, (err) => {
                    console.log(err);
                });
            return deferred.promise;
        }
        saveTemplate() {
            //TODO:: implement to save rules
            var allDefer = [];
            this.saving = true;
            console.log(this.actionItem.actionItemContent)
            allDefer.push(this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.actionItem.actionItemContent)
                .then((response:any) => {
                    if(response.data.success) {
                        return {success: true, type: "template", data: response.data.actionItem};
                    } else {
                        return {success: false};
                    }
                }, (err) => {
                    console.log(err);
                    return {success: false};
                }));
            // set seq order in rule array with it's index
            angular.forEach(this.rules, (item) => {
                item.statusRuleSeqOrder = this.rules.indexOf(item);
                item.statusId = item.status.id;
            });
            allDefer.push(this.adminActionService.updateActionItemStatusRule(this.rules, this.$state.params.data)
                .then((response: any) => {
                    if(response.data.success) {
                        this.getRules();
                        return {success: true};
                    } else {
                        return {success: false};
                    }
                }, (err)=> {
                    console.log(err);
                    return {success: false};
                }));
            this.$q.all(allDefer)
                .then((response:any)=> {
                    this.saving = false;
                    var notiParams = {};
                    var errorItem = response.filter((item)=>{
                        return item.success === false;
                    });
                    var newData = response.filter((item) => {
                        return item.type && item.type === "template";
                    });
                    if(errorItem.length === 0) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: newData[0].data
                        };
                        this.handleNotification( notiParams );
                        this.templateSelect =  false;
                        this.actionItem = newData[0].data;
                        this.trustActionItemContent();
                        this.openContentPanel();
                    } else {
                        //this.saveErrorCallback(response.data.message); //todo: add callback error on actionitem open page
                        console.log("error:");
                    }
                }, (err) => {
                    console.log(err);
                    this.saving=false;
                });
        }

        getRules() {
            this.adminActionStatusService.getRules(this.$state.params.data)
                .then((response) => {
                    this.rules = response.data;
                    angular.forEach(this.rules, (item) => {
                        //item.statusRuleLabelText = this.trustActionItemRules(item.statusRuleLabelText);
                        item.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(item.statusRuleLabelText)).toString();
                        console.log(item.statusName);
                        item["status"] = {
                            actionItemStatus: item.statusName,
                            actionItemStatusId: item.statusId
                        }

                    });
                    this.rules.sort((a, b) => {
                        return a.statusRuleSeqOrder - b.statusRuleSeqOrder;
                    });
                }, (err) => {
                    console.log("error:" + err);
            });
        }

        getStatus() {
            var deferred = this.$q.defer();
            this.adminActionStatusService.getRuleStatus()
                .then((response) => {
                    this.statuses = response.data;

                    angular.forEach(this.statuses, (item) => {
                        if (item.actionItemStatusActive == "N" || item.actionItemStatusDefault == 'Y' ) {
                            var index = this.statuses.indexOf(item);
                            this.statuses.splice(index, 1);
                        }
                    });
                    deferred.resolve();
                    // deferred.resolve(this.openPanel("content"));
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }
        validateActionItemRule() {
            if (this.selectedTemplate && !this.saving) {
                if (this.rules.length === 0) {
                    return true;
                } else {
                    var invalidRule = this.rules.filter((item) => {
                        return !item.statusRuleLabelText || item.statusRuleLabelText==="" || !item.status || !item.status.id;
                    });
                    if (invalidRule.length===0) {
                        return true;
                    }
                    return false;
                }
            }
            return false;
        }
    }

}
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
