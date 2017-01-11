///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
///<reference path="../../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemBlockCtrl = (function () {
        function AdminActionItemBlockCtrl($scope, $q, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile, $timeout, $interpolate, SpinnerService, AdminActionService, AdminActionStatusService, APP_ROOT, CKEDITORCONFIG) {
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
            this.blockedProcess = [];
            this.allBlockProcessList = [];
            this.alreadyGenerated = [];
            this.editMode = false;
            this.isSaving = false;
            this.init();
            angular.element($window).bind('resize', function () {
                if (!$scope.$root.$$phase) {
                    $scope.$apply();
                }
            });
        }
        ;
        AdminActionItemBlockCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            promises.push(this.getBlockedProcessList(this.$state.params.data));
            promises.push(this.getBlockedProcessList());
            //if needed, add more deferred job into promises list
            this.$q.all(promises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminActionItemBlockCtrl.prototype.getBlockedProcessList = function (actionItemId) {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionService.getBlockedProcess(actionItemId)
                .then(function (response) {
                if (response.data.success) {
                    if (actionItemId) {
                        _this.blockedProcess = response.data.blockedProcesses;
                    }
                    else {
                        _this.allBlockProcessList = response.data.blockedProcesses;
                    }
                }
                else {
                    console.log(response.data.message);
                    _this.blockedProcess = [];
                }
                deferred.resolve(response.data.blockedProcesses);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        AdminActionItemBlockCtrl.prototype.addNewItem = function () {
            var available = this.getAvailable();
            if (available.length > 0) {
                this.blockedProcess.push(available[0]);
            }
        };
        AdminActionItemBlockCtrl.prototype.getAvailable = function () {
            var _this = this;
            return this.allBlockProcessList.filter(function (item) {
                var blocked = _this.blockedProcess.filter(function (_item) {
                    return _item.name === item.name;
                });
                var generated = _this.alreadyGenerated.filter(function (_item) {
                    return _item.name === item.name;
                });
                if (blocked.length === 0 && generated.length === 0) {
                    return item;
                }
            });
        };
        AdminActionItemBlockCtrl.prototype.isEmpty = function (obj) {
            if (Object.keys(obj).length === 0) {
                return true;
            }
            else {
                return false;
            }
        };
        AdminActionItemBlockCtrl.prototype.handleNotification = function (noti) {
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
        AdminActionItemBlockCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() +
                $(".status-rules").height() + 250;
            // $("#outerFooter").height() - 30;
            return { "min-height": containerHeight };
        };
        AdminActionItemBlockCtrl.prototype.getTemplateContentHeight = function () {
            var containerHeight = $($(".xe-tab-container")[0]).height() -
                $(".xe-tab-nav").height();
            return { height: containerHeight };
        };
        AdminActionItemBlockCtrl.prototype.enterEditMode = function () {
            this.editMode = true;
        };
        AdminActionItemBlockCtrl.prototype.cancel = function () {
            var _this = this;
            //reset selected items then exit edit mode
            this.getBlockedProcessList(this.$state.params.data)
                .then(function (response) {
                _this.alreadyGenerated = [];
                _this.editMode = false;
            }, function (error) {
                console.log("something wrong");
                _this.alreadyGenerated = [];
                _this.editMode = false;
            });
        };
        AdminActionItemBlockCtrl.prototype.validateActionBlockProcess = function () {
            if (this.alreadyGenerated.length === 0 || this.isSaving) {
                return false;
            }
            return true;
        };
        AdminActionItemBlockCtrl.prototype.saveBlocks = function () {
            var _this = this;
            //save selected items then exit edit mode
            this.editMode = false;
            this.isSaving = true;
            // items: this.alreadyGenerated[{id:id, name: "name", value:{processNamei18n:"i18n", urls:["url"]}}]
            // actionItemId: this.$state.params.data
            this.adminActionService.updateBlockedProcessItems(this.$state.params.data, this.alreadyGenerated)
                .then(function (response) {
                _this.isSaving = false;
            }, function (error) {
                _this.isSaving = false;
            });
        };
        return AdminActionItemBlockCtrl;
    }());
    AIP.AdminActionItemBlockCtrl = AdminActionItemBlockCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemBlockCtrl", AIP.AdminActionItemBlockCtrl);
//# sourceMappingURL=adminActionItemBlockProcessCtrl.js.map