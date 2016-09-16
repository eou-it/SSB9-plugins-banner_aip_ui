///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemOpenPageCtrl = (function () {
        function AdminActionItemOpenPageCtrl($scope, $q, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile, $timeout, $interpolate, SpinnerService, AdminActionService, APP_ROOT) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
                "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "APP_ROOT"];
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
            this.init();
            angular.element($window).bind('resize', function () {
                // $scope.onResize();
                if (!$scope.$root.$$phase) {
                    $scope.$apply();
                }
                // $scope.$evalAsync(() => {
                //     $scope.$apply();
                // });
            });
        }
        AdminActionItemOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.openOverviewPanel();
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
                // var actionItemFolder:any = $("#actionItemTemplate");
                // if(actionItemFolder) {
                //     actionItemFolder.select2({
                //         width: "25em",
                //         minimumResultsForSearch: Infinity,
                //         placeholderOption: "first"
                //     });
                // }
            });
        };
        AdminActionItemOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var data = noti.data.newActionItem;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.action.add.success"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
        };
        AdminActionItemOpenPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() - 30;
            return { "min-height": containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.getSeparatorHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $(".xe-tab-container").height() -
                $("#outerFooter").height() - 30;
            return { "height": containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.getTemplateContentHeight = function () {
            var containerHeight = $($(".xe-tab-container")[0]).height() -
                $(".xe-tab-nav").height();
            return { height: containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.openOverviewPanel = function () {
            var _this = this;
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
            }, function (err) {
                console.log(err);
            });
            return this.openPanel("overview");
        };
        AdminActionItemOpenPageCtrl.prototype.openContentPanel = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemTemplates()
                .then(function (response) {
                _this.templates = response.data;
            }, function (error) {
                console.log(error);
            });
            return this.openPanel("content");
        };
        AdminActionItemOpenPageCtrl.prototype.openPanel = function (panelName) {
            var _this = this;
            var deferred = this.$q.defer();
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
                .then(function (template) {
                var compiled = _this.$compile(template)(_this.scope);
                deferred.resolve(compiled);
                if (panelName === "overview") {
                    _this.$timeout(function () {
                        //change page title
                        $("#title-panel").children()[0].innerHTML = _this.actionItem.actionItemName;
                    }, 0);
                }
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.isNoContent = function () {
            if (this.templateSelect) {
                return false;
            }
            else {
                if (!this.actionItem.actionItemTemplateId) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        AdminActionItemOpenPageCtrl.prototype.loadReadOnlyContent = function () {
            var actionItemHtmlText = this.$sce.trustAsHtml(this.actionItem.actionItemContent);
            return actionItemHtmlText;
        };
        AdminActionItemOpenPageCtrl.prototype.selectTemplate = function () {
            var _this = this;
            this.templateSelect = true;
            this.$timeout(function () {
                var actionItemTemplate = $("#actionItemTemplate");
                if (actionItemTemplate) {
                    actionItemTemplate.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });
                }
                $(".actionItemContent").height($(".actionItemElement").height() - $(".xe-tab-nav").height());
                CKEDITOR.instances['templateContent'].setData(_this.$sce.trustAsHtml(_this.actionItem.actionItemContent));
            }, 500);
        };
        AdminActionItemOpenPageCtrl.prototype.cancel = function (option) {
            switch (option) {
                case "content":
                    this.templateSelect = false;
                    break;
                default:
                    break;
            }
        };
        AdminActionItemOpenPageCtrl.prototype.saveValidate = function () {
            if (this.selectedTemplate && !this.saving) {
                return true;
            }
            return false;
        };
        AdminActionItemOpenPageCtrl.prototype.saveTemplate = function () {
            var _this = this;
            this.saving = true;
            this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId)
                .then(function (response) {
                _this.saving = false;
                var notiParams = {};
                if (response.data.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response.data
                    };
                    _this.handleNotification(notiParams);
                    _this.templateSelect = false;
                    _this.actionItem = response.data.actionItem;
                    _this.openContentPanel();
                }
                else {
                    //this.saveErrorCallback(response.data.message); //todo: add callback error on actionitem open page
                    console.log("error:");
                    console.log(response);
                }
            }, function (err) {
                console.log(err);
                _this.saving = false;
            });
        };
        AdminActionItemOpenPageCtrl.prototype.saveActionItemContent = function () {
            var _this = this;
            this.adminActionService.updateActionItemContent(this.actionItem)
                .then(function (response) {
                var notiParams = {};
                if (response.data.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response.data
                    };
                    _this.$state.go("admin-action-open", { noti: notiParams, data: response.data.newActionItem.id });
                }
                else {
                    //this.saveErrorCallback(response.data.message); //todo: add callback error on actionitem open page
                    console.log("error:");
                    console.log(response);
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
        };
        return AdminActionItemOpenPageCtrl;
    }());
    AIP.AdminActionItemOpenPageCtrl = AdminActionItemOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
//# sourceMappingURL=adminActionItemOpenPageCtrl.js.map