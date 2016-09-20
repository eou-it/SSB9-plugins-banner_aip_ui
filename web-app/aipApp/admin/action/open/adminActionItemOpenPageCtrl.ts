///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {

    export class AdminActionItemOpenPageCtrl{
        $inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
            "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "APP_ROOT", "CKEDITORCONFIG"];
        adminActionService: AIP.AdminActionService;
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
        CKEDITORCONFIG;
        templates;
        templateSelect: boolean;
        selectedTemplate;
        updatedContent;
        constructor($scope, $q:ng.IQService, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile,
                    $timeout, $interpolate, SpinnerService, AdminActionService, APP_ROOT, CKEDITORCONFIG) {
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
            this.spinnerService = SpinnerService;
            this.APP_ROOT = APP_ROOT;
            this.CKEDITORCONFIG = CKEDITORCONFIG;
            this.actionItem = {};
            this.templateSelect = false;
            this.templates = [];
            this.selectedTemplate;
            this.updatedContent;
            this.init();
            angular.element($window).bind('resize', function() {
                // $scope.onResize();
                if(!$scope.$root.$$phase) {
                    $scope.$apply();
                }
                // $scope.$evalAsync(() => {
                //     $scope.$apply();
                // });
            });
        }

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];

            this.openOverviewPanel();
            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            this.$q.all( promises ).then( () => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner( false );
                // var actionItemFolder:any = $("#actionItemTemplate");
                // if(actionItemFolder) {
                //     actionItemFolder.select2({
                //         width: "25em",
                //         minimumResultsForSearch: Infinity,
                //         placeholderOption: "first"
                //     });
                // }
            } );
        }

        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                var data = noti.data.newActionItem;
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
                $("#outerFooter").height() - 30;
            return {"min-height": containerHeight};
        }
        getSeparatorHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $(".xe-tab-container").height() -
                $("#outerFooter").height() - 30;
            return {"height": containerHeight};
        }
        getTemplateContentHeight() {
            var containerHeight = $($(".xe-tab-container")[0]).height() -
                    $(".xe-tab-nav").height();
            return {height: containerHeight};
        }
        openOverviewPanel() {
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then((response:AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    this.selectedTemplate = this.actionItem.actionItemTemplateId;
                    $("#title-panel h1" ).html(this.actionItem.actionItemName);

                }, (err) => {
                    console.log(err);
                });
            return this.openPanel("overview");
        }
        openContentPanel() {
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemTemplates()
                .then((response) => {
                    this.templates = response.data;
                }, (error) => {
                    console.log(error);
                });
            return this.openPanel("content");
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

        trustActionItemContent = function() {
            this.actionItem.actionItemContent = this.$filter("html")(this.$sce.trustAsHtml(this.actionItem.actionItemContent));
            return this.actionItem.actionItemContent;
        }

        selectTemplate() {
            this.trustActionItemContent();
            console.log(this.actionItem.actionItemContent);
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
            }, 500);
        }
        cancel(option) {
            switch(option) {
                case "content":
                    this.templateSelect = false;
                    break;
                default:
                    break;
            }
        }
        saveTemplate() {
            this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.actionItem.actionItemContent)
                .then((response:any) => {
                    var notiParams = {};
                    if(response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.handleNotification( notiParams );
                        this.templateSelect =  false;
                        this.actionItem = response.data.actionItem;
                        this.openContentPanel();
                    } else {
                        //this.saveErrorCallback(response.data.message); //todo: add callback error on actionitem open page
                        console.log("error:");
                    }
                }, (err) => {
                    console.log(err);
                });
        }
        saveActionItemContent() {
            this.adminActionService.updateActionItemContent(this.actionItem)
                .then((response:AIP.IActionItemSaveResponse) => {
                    var notiParams = {};
                    if(response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.$state.go("admin-action-open", {noti: notiParams, data: response.data.newActionItem.id});
                    } else {
                        //this.saveErrorCallback(response.data.message); //todo: add callback error on actionitem open page
                        console.log("error:");
                    }
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
        }

    }

}

register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
