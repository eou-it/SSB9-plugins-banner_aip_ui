///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;
declare var CKEDITOR: any;
declare var ckInstance: any;

module AIP {

    export class AdminActionItemOpenPageCtrl{
        $inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
            "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "APP_ROOT"];
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
        scope;
        APP_ROOT;
        templates;
        templateSelect: boolean;
        selectedTemplate;
        updatedContent;
        saving;
        constructor($scope, $q:ng.IQService, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile,
                    $timeout, $interpolate, SpinnerService, AdminActionService, APP_ROOT) {
            $scope.vm = this;
            this.scope = $scope;
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
            this.actionItem = {};
            this.templateSelect = false;
            this.templates = [];
            this.selectedTemplate;
            this.saving = false;
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
                    var compiled = this.$compile(template)(this.scope);
                    deferred.resolve(compiled);
                    if(panelName === "overview") {
                        this.$timeout(()=> {
                            //change page title
                            $("#title-panel").children()[0].innerHTML = this.actionItem.actionItemName
                        }, 0)
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

        loadReadOnlyContent() {
            var actionItemHtmlText = this.$sce.trustAsHtml(this.actionItem.actionItemContent);
            return actionItemHtmlText;
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
                CKEDITOR.instances['templateContent'].setData( this.$sce.trustAsHtml(this.actionItem.actionItemContent) );
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
        saveValidate() {
            if (this.selectedTemplate && !this.saving) {
                return true;
            }
            return false;
        }
        saveTemplate() {
            this.saving = true;
            this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId)
            //console.log(this.actionItem.actionItemContent);
            //this.updatedContent = CKEDITOR.instances['templateContent'].getData();

            this.updatedContent = this.$filter("trusted")( this.$sce.trustAsHtml(CKEDITOR.instances['templateContent'].getData()) ).toString();
            this.actionItem.actionItemContent = this.updatedContent.toString();

            /*
            try {
                CKEDITOR.instances['templateContent'].destroy(true);
            } catch (e) { }
            CKEDITOR.replace('templateContent');
            */

            console.log("trusted");
            console.log(CKEDITOR.instances['templateContent']);

            this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.updatedContent)
                .then((response:any) => {
                    this.saving = false;
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
                    this.saving=false;
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
