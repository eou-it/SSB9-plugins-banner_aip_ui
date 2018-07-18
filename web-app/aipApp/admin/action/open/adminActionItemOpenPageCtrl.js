/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/admin/adminActionStatusService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemOpenPageCtrl = /** @class */ (function () {
        function AdminActionItemOpenPageCtrl($scope, $rootScope, $q, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile, $timeout, $interpolate, SpinnerService, AdminActionService, AdminActionStatusService, APP_ROOT, CKEDITORCONFIG) {
            this.$inject = ["$scope", "$rootScope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile", "$timeout", "$interpolate", "SpinnerService", "AdminActionService", "AdminActionStatusService", "APP_ROOT", "CKEDITORCONFIG"];
            this.trustAsHtml = function (string) {
                return this.$sce.trustAsHtml(string);
            };
            this.trustActionItemContent = function () {
                this.actionItem.actionItemContent = this.$sce.trustAsHtml(this.actionItem.actionItemContent);
                return this.actionItem.actionItemContent;
            };
            this.trustActionItemRules = function (statusRuleLabelText) {
                this.rules.statusRuleLabelText = this.$sce.trustAsHtml(this.$filter("html")(this.rules.statusRuleLabelText)).toString();
                return this.rules.statusRuleLabelText;
            };
            $scope.vm = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
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
            this.actionItemDataChanged = false;
            this.redirectval = "NoData";
            this.init();
            angular.element($window).bind('resize', function () {
                if (!$scope.$root.$phase) {
                    $scope.$apply();
                }
            });
            console.log(this.actionItemPostedStatus);
        }
        ;
        AdminActionItemOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.actionFolder = this.$state.params.actionItemId || this.$state.previousParams.actionItemId;
            this.openOverviewPanel();
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            promises.push(this.getStatus());
            promises.push(this.getRules());
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
                _this.contentChanged = false;
                _this.specialCharacterTranslation();
            });
            var that = this;
            this.$scope.$on("DetectChanges", function (event, args) {
                if (that.actionItemDataChanged) {
                    that.redirectval = args.state;
                    that.checkEditchangesDone('content');
                }
            });
        };
        AdminActionItemOpenPageCtrl.prototype.detectContentChange = function (content) {
            if (this.templateSelect) {
                this.contentChanged = true;
                this.dataChanged();
            }
        };
        AdminActionItemOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess" || noti.notiType === "editSuccess") {
                var message = "";
                if (noti.notiType === "saveSuccess") {
                    message = this.$filter("i18n_aip")("aip.common.save.successful");
                }
                else if (noti.notiType === "editSuccess") {
                    message = this.$filter("i18n_aip")("aip.common.edit.successful");
                }
                var n = new Notification({
                    message: message,
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
            this.adminActionService.getActionItemDetail(this.actionFolder)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
                _this.actionItem.actionItemContent = _this.trustAsHtml(response.data.actionItem.actionItemContent);
                _this.selectedTemplate = _this.actionItem.actionItemTemplateId;
                _this.actionItemPostedStatus = _this.actionItem.actionItemPostedStatus;
                console.log(_this.actionItemPostedStatus);
                if (_this.templateSelect) {
                    _this.selectTemplate();
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
                console.log(_this.templates);
                deferred.resolve(_this.openPanel("content"));
                _this.getTemplateSource();
                _this.contentChanged = false;
                if (_this.templateSelect) {
                    _this.selectTemplate();
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
            var newScope = this.$scope.$new(true); // isolate scope
            newScope.vm = this.$scope.vm;
            var templateUrl = this.$sce.getTrustedResourceUrl(url);
            this.$templateRequest(templateUrl)
                .then(function (template) {
                var compiled = _this.$compile(template)(newScope);
                deferred.resolve(compiled);
                if (panelName === "overview") {
                    if (_this.actionItem.actionItemPostedStatus == "Y") {
                        $("#title-panel h1").html(_this.actionItem.actionItemName + ' ' + _this.$filter("i18n_aip")("aip.admin.actionItem.title.posted"));
                    }
                    else {
                        $("#title-panel").children()[0].innerHTML = _this.actionItem.actionItemName;
                    }
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
        AdminActionItemOpenPageCtrl.prototype.validateEdit = function (type) {
            console.log("Type val", type);
            console.log(this.actionItem.actionItemId);
            if (type === "overview") {
                this.$state.go("admin-action-edit", { actionItemId: this.actionItem.actionItemId, isEdit: true });
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
        AdminActionItemOpenPageCtrl.prototype.specialCharacterTranslation = function () {
            for (var j = 0; j < this.rules.length; j++) {
                if (this.rules[j].statusName.indexOf('&amp;') > -1) {
                    this.rules[j].statusName = this.rules[j].statusName.replace("&amp;", "&");
                }
                if (this.rules[j].statusName.indexOf('&quot;') > -1) {
                    this.rules[j].statusName = this.rules[j].statusName.replace("&quot;", "\"");
                }
                if ((this.rules[j].statusName.indexOf('&#039;') > -1) || (this.rules[j].statusName.indexOf('&#39;') > -1)) {
                    this.rules[j].statusName = this.rules[j].statusName.replace("&#039;", "\'");
                    this.rules[j].statusName = this.rules[j].statusName.replace("&#39;", "\'");
                }
                if (this.rules[j].statusName.indexOf('&lt;') > -1) {
                    this.rules[j].statusName = this.rules[j].statusName.replace("&lt;", "<");
                }
                if (this.rules[j].statusName.indexOf('&gt;') > -1) {
                    this.rules[j].statusName = this.rules[j].statusName.replace("&gt;", ">");
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
                $(".actionItemContent").height($(".actionItemElement").height() - $(".xe-tab-nav").height());
                //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                //action item selected temlate
            }, 500);
        };
        AdminActionItemOpenPageCtrl.prototype.cancelContentEdit = function (option) {
            var _this = this;
            var deferred = this.$q.defer();
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.actionFolder = this.$state.params.actionItemId || this.$state.previousParams.actionItemId;
            this.adminActionService.getActionItemDetail(this.actionFolder)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
                _this.selectedTemplate = _this.actionItem.actionItemTemplateId;
                _this.trustActionItemContent();
                switch (option) {
                    case "content":
                        _this.templateSelect = false;
                        promises.push(_this.getStatus());
                        promises.push(_this.getRules());
                        _this.$q.all(promises).then(function () {
                            //TODO:: turn off the spinner
                            _this.spinnerService.showSpinner(false);
                            _this.contentChanged = false;
                        });
                        break;
                    default:
                        break;
                }
                deferred.resolve(_this.openPanel(option));
            }, function (err) {
                console.log(err);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.dataChanged = function () {
            this.actionItemDataChanged = true;
            this.$rootScope.DataChanged = true;
        };
        AdminActionItemOpenPageCtrl.prototype.reset = function (option) {
            var _this = this;
            var deferred = this.$q.defer();
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.actionFolder = this.$state.params.actionItemId || this.$state.previousParams.actionItemId;
            this.adminActionService.getActionItemDetail(this.actionFolder)
                .then(function (response) {
                _this.actionItem = response.data.actionItem;
                _this.selectedTemplate = _this.actionItem.actionItemTemplateId;
                _this.trustActionItemContent();
                switch (option) {
                    case "content":
                        _this.templateSelect = false;
                        promises.push(_this.getStatus());
                        promises.push(_this.getRules());
                        _this.$q.all(promises).then(function () {
                            //TODO:: turn off the spinner
                            _this.spinnerService.showSpinner(false);
                            _this.contentChanged = false;
                        });
                        break;
                    default:
                        break;
                }
                deferred.resolve(_this.openPanel(option));
            }, function (err) {
                console.log(err);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.cancel = function (option) {
            this.redirectval = "NoData";
            this.checkEditchangesDone(option);
        };
        AdminActionItemOpenPageCtrl.prototype.checkEditchangesDone = function (option) {
            var that = this;
            if (that.actionItemDataChanged || that.contentChanged) {
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.actionItem.saveChanges"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    notifications.remove(n);
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    that.actionItemDataChanged = false;
                    that.$rootScope.DataChanged = false;
                    that.contentChanged = false;
                    if (that.redirectval === "NoData") {
                        that.reset(option);
                    }
                    else {
                        location.href = that.redirectval;
                    }
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else {
                that.reset(option);
            }
        };
        AdminActionItemOpenPageCtrl.prototype.saveTemplate = function () {
            var _this = this;
            //TODO:: implement to save rules
            var allDefer = [];
            this.saving = true;
            if (this.actionItem.actionItemContent && $.type(this.actionItem.actionItemContent) != 'string') {
                this.actionItem.actionItemContent = this.$sce.getTrustedHtml(this.actionItem.actionItemContent);
            }
            allDefer.push(this.adminActionService.saveActionItemTemplate(this.selectedTemplate, this.actionItem.actionItemId, this.actionItem.actionItemContent)
                .then(function (response) {
                if (response.data.success) {
                    return { success: true, type: "template", data: response.data.actionItem };
                }
                else {
                    return { success: false, errors: response.data.errors };
                }
            }, function (err) {
                console.log(err);
                return { success: false };
            }));
            // set seq order in rule array with it's index
            angular.forEach(this.rules, function (item) {
                item.statusRuleSeqOrder = _this.rules.indexOf(item);
                item.statusId = item.statusId;
                item.reviewReqInd = item.reviewReqInd ? true : false;
            });
            allDefer.push(this.adminActionService.updateActionItemStatusRule(this.rules, this.actionFolder)
                .then(function (response) {
                if (response.data.success) {
                    _this.getRules();
                    return { success: true };
                }
                else {
                    return { success: false, errors: response.data.errors };
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
                    _this.saveErrorCallback(response[0].error);
                    console.log("error:");
                }
            }, function (err) {
                _this.saveErrorCallback(err);
                console.log(err);
                _this.saving = false;
            });
            this.actionItemDataChanged = false;
            this.$rootScope.DataChanged = false;
        };
        AdminActionItemOpenPageCtrl.prototype.getRules = function () {
            var _this = this;
            this.adminActionStatusService.getRules(this.actionFolder)
                .then(function (response) {
                _this.rules = response.data;
                console.log(_this.rules);
                angular.forEach(_this.rules, function (item) {
                    //item.statusRuleLabelText = this.trustActionItemRules(item.statusRuleLabelText);
                    item.statusRuleLabelText = _this.$sce.trustAsHtml(_this.$filter("html")(item.statusRuleLabelText)).toString();
                    item["status"] = {
                        actionItemStatus: item.statusName,
                        actionItemStatusId: item.statusId ? item.statusId : item.status.id
                    };
                    item.reviewReqInd = item.statusReviewReqInd;
                });
                _this.rules.sort(function (a, b) {
                    return a.statusRuleSeqOrder - b.statusRuleSeqOrder;
                });
            }, function (err) {
                _this.saveErrorCallback(err);
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
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminActionItemOpenPageCtrl.prototype.validateActionItemRule = function () {
            if (this.contentChanged) {
                this.dataChanged();
            }
            if (this.selectedTemplate && !this.saving) {
                if (this.rules.length === 0) {
                    return true;
                }
                else if (!this.contentChanged) {
                    return false;
                }
                else {
                    var invalidRule = this.rules.filter(function (item) {
                        var statusIdExists = true;
                        if (!item.status.id) {
                            statusIdExists = item.status.actionItemStatusId;
                        }
                        return !item.statusRuleLabelText || item.statusRuleLabelText === "" || !statusIdExists;
                    });
                    if (invalidRule.length === 0) {
                        return true;
                    }
                    return false;
                }
            }
            this.actionItemDataChanged = false;
            this.$rootScope.DataChanged = false;
            return false;
        };
        AdminActionItemOpenPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return AdminActionItemOpenPageCtrl;
    }());
    AIP.AdminActionItemOpenPageCtrl = AdminActionItemOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
