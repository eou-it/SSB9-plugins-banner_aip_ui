///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemOpenPageCtrl = (function () {
        function AdminActionItemOpenPageCtrl($scope, $q, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile, $timeout, $interpolate, SpinnerService, AdminActionService, AdminActionStatusService, APP_ROOT, CKEDITORCONFIG) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
                "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "AdminActionStatusService", "APP_ROOT", "CKEDITORCONFIG"];
            this.trustAsHtml = function (string) {
                return this.$sce.trustAsHtml(string);
            };
            this.trustActionItemContent = function () {
                this.actionItem.actionItemContent = this.$sce.trustAsHtml(this.$filter("html")(this.actionItem.actionItemContent)).toString();
                return this.actionItem.actionItemContent;
            };
            this.trustActionItemRules = function (statusRuleLabelText) {
                this.rules.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(this.rules.statusRuleLabelText)).toString();
                return this.rules.statusRuleLabelText;
            };
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
        ;
        AdminActionItemOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.openOverviewPanel();
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            promises.push(this.getStatus());
            promises.push(this.getRules());
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminActionItemOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                // var data = noti.data.newActionItem||noti.data.actionItem;
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
                $("#header-main-section").height() +
                $(".status-rules").height() + 250;
            // $("#outerFooter").height() - 30;
            return { "min-height": containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.getSeparatorHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $(".xe-tab-nav").height() -
                $("#outerFooter").height() - 75;
            return { "min-height": containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.getTemplateContentHeight = function () {
            var containerHeight = $($(".xe-tab-container")[0]).height() -
                $(".xe-tab-nav").height();
            return { height: containerHeight };
        };
        AdminActionItemOpenPageCtrl.prototype.openOverviewPanel = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
                _this.selectedTemplate = _this.actionItem.actionItemTemplateId;
                if (_this.templateSelect) {
                    _this.trustActionItemContent();
                    _this.selectTemplate();
                }
                else {
                    _this.trustActionItemContent();
                }
                deferred.resolve(_this.openPanel("overview"));
            }, function (err) {
                console.log(err);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.openContentPanel = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemTemplates()
                .then(function (response) {
                _this.templates = response.data;
                deferred.resolve(_this.openPanel("content"));
                _this.getTemplateSource();
                if (_this.templateSelect) {
                    _this.selectTemplate();
                }
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.openBlockPanel = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemBlocks()
                .then(function (response) {
                _this.blocks = response.data;
                deferred.resolve(_this.openPanel("block"));
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
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
                case "block":
                    url = this.APP_ROOT + "admin/action/open/block/adminActionItemBlock.html";
                    break;
                default:
                    break;
            }
            var templateUrl = this.$sce.getTrustedResourceUrl(url);
            this.$templateRequest(templateUrl)
                .then(function (template) {
                var compiled = _this.$compile(template)(_this.$scope);
                deferred.resolve(compiled);
                if (panelName === "overview") {
                    $("#title-panel").children()[0].innerHTML = _this.actionItem.actionItemName;
                }
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.isNoTemplate = function () {
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
        AdminActionItemOpenPageCtrl.prototype.isNoContent = function () {
            if (this.templateSelect) {
                return false;
            }
            else {
                if (!this.actionItem.actionItemContent) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        AdminActionItemOpenPageCtrl.prototype.isNoTemplateSelected = function () {
            if (this.templateSelect) {
                if (!this.selectedTemplate) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };
        AdminActionItemOpenPageCtrl.prototype.getTemplateSource = function () {
            if (this.templates) {
                if (this.templates[0].sourceInd == 'B') {
                    this.templateSource = this.$filter("i18n_aip")("aip.common.baseline");
                }
                else {
                    this.templateSource = this.$filter("i18n_aip")("aip.common.local");
                }
            }
            return this.templateSource;
        };
        AdminActionItemOpenPageCtrl.prototype.selectTemplate = function () {
            var _this = this;
            this.templateSelect = true;
            this.$timeout(function () {
                var actionItemTemplate = $("#actionItemTemplate");
                if (_this.actionItem.actionItemTemplateId && actionItemTemplate) {
                    if ($("#actionItemTemplate > option:selected").val() !== _this.actionItem.actionItemTemplateId.toString()) {
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
                if (_this.selectedTemplate) {
                    if (_this.templates[0].sourceInd == "B") {
                    }
                }
            }, 500);
        };
        AdminActionItemOpenPageCtrl.prototype.cancel = function (option) {
            var _this = this;
            this.init();
            var deferred = this.$q.defer();
            this.adminActionService.getActionItemDetail(this.$state.params.data)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
                _this.selectedTemplate = _this.actionItem.actionItemTemplateId;
                _this.trustActionItemContent();
                switch (option) {
                    case "content":
                        _this.templateSelect = false;
                        break;
                    default:
                        break;
                }
                deferred.resolve(_this.openPanel("overview"));
            }, function (err) {
                console.log(err);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.saveTemplate = function () {
            var _this = this;
            //TODO:: implement to save rules
            var allDefer = [];
            this.saving = true;
            allDefer.push(this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.actionItem.actionItemContent)
                .then(function (response) {
                if (response.data.success) {
                    return { success: true, type: "template", data: response.data.actionItem };
                }
                else {
                    return { success: false };
                }
            }, function (err) {
                console.log(err);
                return { success: false };
            }));
            // set seq order in rule array with it's index
            angular.forEach(this.rules, function (item) {
                item.statusRuleSeqOrder = _this.rules.indexOf(item);
                item.statusId = item.status.actionItemStatusId;
            });
            allDefer.push(this.adminActionService.updateActionItemStatusRule(this.rules, this.$state.params.data)
                .then(function (response) {
                if (response.data.success) {
                    _this.getRules();
                    return { success: true };
                }
                else {
                    return { success: false };
                }
            }, function (err) {
                console.log(err);
                return { success: false };
            }));
            this.$q.all(allDefer)
                .then(function (response) {
                _this.saving = false;
                var notiParams = {};
                var errorItem = response.filter(function (item) {
                    return item.success === false;
                });
                var newData = response.filter(function (item) {
                    return item.type && item.type === "template";
                });
                if (errorItem.length === 0) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: newData[0].data
                    };
                    _this.handleNotification(notiParams);
                    _this.templateSelect = false;
                    _this.actionItem = newData[0].data;
                    _this.trustActionItemContent();
                    _this.openContentPanel();
                }
                else {
                    //this.saveErrorCallback(response.data.message); //todo: add callback error on actionitem open page
                    console.log("error:");
                }
            }, function (err) {
                console.log(err);
                _this.saving = false;
            });
        };
        AdminActionItemOpenPageCtrl.prototype.getRules = function () {
            var _this = this;
            this.adminActionStatusService.getRules(this.$state.params.data)
                .then(function (response) {
                _this.rules = response.data;
                angular.forEach(_this.rules, function (item) {
                    //item.statusRuleLabelText = this.trustActionItemRules(item.statusRuleLabelText);
                    item.statusRuleLabelText = _this.$sce.trustAsHtml(_this.$filter("html")(item.statusRuleLabelText)).toString();
                    item["status"] = {
                        actionItemStatus: item.statusName,
                        actionItemStatusId: item.statusId
                    };
                });
                _this.rules.sort(function (a, b) {
                    return a.statusRuleSeqOrder - b.statusRuleSeqOrder;
                });
            }, function (err) {
                console.log("error:" + err);
            });
        };
        AdminActionItemOpenPageCtrl.prototype.getStatus = function () {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionStatusService.getRuleStatus()
                .then(function (response) {
                _this.statuses = response.data;
                angular.forEach(_this.statuses, function (item) {
                    if (item.actionItemStatusActive == "N" || item.actionItemStatusDefault == 'Y') {
                        var index = _this.statuses.indexOf(item);
                        _this.statuses.splice(index, 1);
                    }
                });
                deferred.resolve();
                // deferred.resolve(this.openPanel("content"));
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.validateActionItemRule = function () {
            if (this.selectedTemplate && !this.saving) {
                if (this.rules.length === 0) {
                    return true;
                }
                else {
                    var invalidRule = this.rules.filter(function (item) {
                        return !item.statusRuleLabelText || item.statusRuleLabelText === "" || !item.status || !item.status.actionItemStatusId;
                    });
                    if (invalidRule.length === 0) {
                        return true;
                    }
                    return false;
                }
            }
            return false;
        };
        return AdminActionItemOpenPageCtrl;
    })();
    AIP.AdminActionItemOpenPageCtrl = AdminActionItemOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
//# sourceMappingURL=adminActionItemOpenPageCtrl.js.map