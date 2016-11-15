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
            this.statuses = [];
            this.rules = [];
            this.selectedTemplate;
            this.templateSource;
            this.saving = false;
            this.init();
            angular.element( $window ).bind( 'resize', function () {
                // $scope.onResize();
                if (!$scope.$root.$$phase) {
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
                $("#header-main-section").height() -
                // $("#outerFooter").height() - 30;
                30;
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
                default:
                    break;
            }
            var templateUrl = this.$sce.getTrustedResourceUrl(url);
            this.$templateRequest(templateUrl)
                .then((template) => {
                    var compiled = this.$compile(template)(this.$scope);
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

        trustActionItemContent = function() {
            this.actionItem.actionItemContent = this.$sce.trustAsHtml(this.$filter("html")(this.actionItem.actionItemContent)).toString();
            return this.actionItem.actionItemContent;
        }

        selectTemplate() {
            this.templateSelect = true;
            this.$timeout(() => {
                var actionItemTemplate:any = $("#actionItemTemplate");
                if(actionItemTemplate) {
                    actionItemTemplate.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });
                }
                $(".actionItemContent").height($(".actionItemElement").height() - $(".xe-tab-nav").height());
                //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                //action item selected temlate
                if (this.selectedTemplate) {
                    if (this.templates[0].sourceInd == "B") {
                        $(".select2-container.actionItemSelect .select2-chosen")[0].innerHTML = this.actionItem.actionItemTemplateName + " (" + this.$filter("i18n_aip")("aip.common.baseline") + ")";
                    }
                }
            }, 500);
        }
        cancel(option) {
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
        saveValidate() {
            if (this.selectedTemplate && !this.saving) {
                return true;
            }
            return false;
        }
        saveTemplate() {
            //TODO:: implement to save rules
            var allDefer = [];
            this.saving = true;
            allDefer.push(this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.actionItem.actionItemContent)
                .then((response:any) => {
                    console.log(response);
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
                item.statusRuleSeqOrder = this.rules.indexOf(item)
                item.statusId = item.status.actionItemStatusId;
            });
            allDefer.push(this.adminActionService.updateActionItemStatusRule(this.rules, this.$state.params.data)
                .then((response: any) => {
                    console.log(response);
                    if(response.data.success) {
                        return {success: true};
                    } else {
                        return {success: false};
                    }
                }, (err)=> {
                    console.log(err);
                    return {success: false};
                }));
            this.$q.all(allDefer)
                .then((response)=> {
                    this.saving = false;
                    var notiParams = {};
                    var errorItem = response.filter((item)=>{
                        return item.success === false;
                    });
                    var newData = response.filter((item) => {
                        return item.type && item.type="template";
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
            this.adminActionService.getStatus()
                .then((response) => {
                    this.statuses = response.data;
                    console.log(this.statuses);
                    deferred.resolve();
                    // deferred.resolve(this.openPanel("content"));
                }, (error) => {
                    console.log(error);
                });
            return deferred.promise;
        }
    }


}
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
