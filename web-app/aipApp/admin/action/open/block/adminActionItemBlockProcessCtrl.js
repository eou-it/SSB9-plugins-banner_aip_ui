/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
            this.addBlockProcessData;
            this.process;
            this.personaData;
            this.assignedActionItems = [];
            this.initialAssigned = [];
            this.allActionItems = [];
            this.globalBlockProcess = false;
            this.blockedProcess = [];
            this.allBlockProcessList = [];
            this.alreadyGenerated = [];
            this.selected = [];
            this.originalAssign = [];
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
            promises.push(this.getBlockedProcessList(this.$state.params.actionItemId));
            /*  promises.push(this.getBlockedProcessList());*/
            //if needed, add more deferred job into promises list
            this.$q.all(promises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
            promises.push();
        };
        AdminActionItemBlockCtrl.prototype.getBlockedProcessList = function (actionItemId) {
            var _this = this;
            var deferred = this.$q.defer();
            this.adminActionService.getBlockedProcess(actionItemId)
                .then(function (response) {
                if (response.data) {
                    if (actionItemId) {
                        _this.blockedProcess = response.data.blockedProcess || response.data;
                        _this.globalBlockProcess = response.data.globalBlockProcess;
                        _this.allBlockProcessList = response.data;
                    }
                    else {
                        _this.allBlockProcessList = response.data.blockedProcess;
                    }
                }
                else {
                    _this.blockedProcess = [];
                }
                deferred.resolve(response.data.blockedProcess);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };
        AdminActionItemBlockCtrl.prototype.enterEditMode = function () {
            var _this = this;
            this.adminActionService.loadBlockingProcessLov1().then(function (response) {
                _this.allActionItems = response.data;
                var that = _this;
                _this.personaData = [];
                angular.forEach(_this.allActionItems.persona, function (value, key) {
                    {
                        _this.personaData.push(key);
                    }
                });
                if (_this.blockedProcess.length !== 0) {
                    _this.editMode = true;
                    var editBlockData = [];
                    var name;
                    var persona;
                    var personAllowed;
                    var urls;
                    var id;
                    _this.globalBlockProcess;
                    angular.forEach(_this.blockedProcess, function (key) {
                        if (key.processPersonaBlockAllowedInd === 'N') {
                            key.blockedProcessAppRole = "";
                        }
                        {
                            editBlockData.push({ process: { id: key.id.blockingProcessId, name: key.processName, urls: key.urls, personAllowed: key.processPersonaBlockAllowedInd }, persona: key.blockedProcessAppRole });
                        }
                    });
                    _this.selected = editBlockData;
                    console.log(_this.selected);
                    //this.originalAssign = angular.copy(this.selected);
                }
                else {
                    _this.editMode = true;
                    _this.addNew();
                }
                _this.$window.onbeforeunload = function (event) {
                    if (_this.isChanged()) {
                        // reset to default event listener
                        return _this.$filter("i18n_aip")("aip.common.admin.unsaved");
                    }
                    // reset to default event listener
                    _this.$window.onbeforeunload = null;
                };
            }, function (err) {
                console.log(err);
            });
        };
        AdminActionItemBlockCtrl.prototype.isChanged = function () {
            var changed = false;
            if (this.assignedActionItems.length !== this.initialAssigned.length) {
                return true;
            }
            for (var i = 0; i < this.assignedActionItems.length; i++) {
                var item = this.assignedActionItems[i];
                var initial = this.initialAssigned.filter(function (_item) {
                    return _item.id === item.id;
                });
                if (initial.length === 0 ||
                    ((item.actionItemId !== initial[0].actionItemId) || (item.sequenceNumber !== initial[0].sequenceNumber))) {
                    changed = true;
                    break;
                }
            }
            return changed;
        };
        AdminActionItemBlockCtrl.prototype.reAssignSeqnumber = function () {
            this.selected.map(function (item, index) {
                item.seq = index + 1;
                return item;
            });
            this.assignedActionItems.map(function (item, index) {
                item.sequenceNumber = index + 1;
                return item;
            });
        };
        AdminActionItemBlockCtrl.prototype.delete = function (item) {
            var itemIdx = this.assignedActionItems.indexOf(item);
            this.assignedActionItems.splice(itemIdx, 1);
            this.selected.splice(itemIdx, 1);
            this.reAssignSeqnumber();
        };
        AdminActionItemBlockCtrl.prototype.addNew = function () {
            this.selected.push({});
        };
        AdminActionItemBlockCtrl.prototype.validateAddInput = function () {
            var notSelected = this.selected.filter(function (item) {
                if (item.process && item.process.personAllowed == "Y") {
                    return !item.persona;
                }
                return !item.process;
            });
            if (notSelected.length === 0 && !this.isSaving) {
                return false;
            }
            return true;
        };
        AdminActionItemBlockCtrl.prototype.validateActionBlockProcess = function () {
            var validation = true;
            var unassigned = this.selected.filter(function (item) {
                if (item.process && item.process.personAllowed !== "N") {
                    return !item.persona;
                }
                return !item.process;
            });
            if (this.originalAssign.length > 0 && this.isEqual(this.selected, this.originalAssign)) {
                validation = false;
            }
            if (unassigned.length !== 0) {
                validation = false;
            }
            return validation;
        };
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
                    message: this.$filter("i18n_aip")("aip.common.save.successful"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
            else if (noti.notiType === "saveFailed") {
                var n1 = new Notification({
                    message: noti.data,
                    type: "error",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n1);
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
        AdminActionItemBlockCtrl.prototype.cancel = function () {
            var _this = this;
            //reset selected items then exit edit mode
            this.getBlockedProcessList(this.$state.params.actionItemId)
                .then(function (response) {
                _this.alreadyGenerated = [];
                _this.editMode = false;
            }, function (error) {
                console.log("something wrong");
                _this.alreadyGenerated = [];
                _this.editMode = false;
            });
        };
        AdminActionItemBlockCtrl.prototype.isEqual = function (item1, item2) {
            var item1Properties = item1.map(function (item) {
                return [item.process.name, item.persona];
            });
            var item2Properties = item2.map(function (item) {
                return [item.process.name, item.persona];
            });
            if (angular.equals(item1Properties, item2Properties)) {
                return true;
            }
            return false;
        };
        AdminActionItemBlockCtrl.prototype.saveSucess = function () {
            var _this = this;
            var saveData = this.selected.map(function (item) {
                if (item.process.personAllowed === "N") {
                    item.persona = "";
                }
                return { processId: item.process.id, persona: item.persona };
            });
            this.adminActionService.updateBlockedProcessItems(this.$state.params.actionItemId, this.globalBlockProcess, saveData)
                .then(function (response) {
                _this.getBlockedProcessList(_this.$state.params.actionItemId);
                if (response.data.success) {
                    var notiParams = {};
                    notiParams = {
                        notiType: "saveSuccess",
                        noti: notiParams,
                        data: response.data.success
                    };
                    _this.handleNotification(notiParams);
                }
                if (response.data.success) {
                    var notiParams = {};
                    notiParams = {
                        notiType: "saveSuccess",
                        noti: notiParams,
                        data: response.data.success
                    };
                    _this.handleNotification(notiParams);
                }
                else {
                    var notiParams = {};
                    notiParams = {
                        notiType: "saveFailed",
                        noti: notiParams,
                        data: response.data.message
                    };
                    _this.handleNotification(notiParams);
                    _this.editMode = true;
                }
                _this.isSaving = false;
            }, function (error) {
                _this.isSaving = false;
            });
            this.editMode = false;
        };
        AdminActionItemBlockCtrl.prototype.saveBlocks = function () {
            var _this = this;
            var that = this;
            //save selected items then exit edit mode
            //this.editMode = false;
            this.isSaving = true;
            // items: this.alreadyGenerated[{id:id, name: "name", value:{processNamei18n:"i18n", urls:["url"]}}]
            // actionItemId: this.$state.params.data
            this.adminActionService.checkActionItemPosted(this.$state.params.actionItemId)
                .then(function (response) {
                if (response.posted) {
                    var n = new Notification({
                        message: _this.$filter("i18n_aip")("aip.admin.halt.content.save.warning"),
                        type: "warning"
                    });
                    n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                        notifications.remove(n);
                        _this.saveSucess();
                    });
                    n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.no"), function () {
                        notifications.remove(n);
                        _this.editMode = true;
                    });
                    notifications.addNotification(n);
                }
                else {
                    _this.saveSucess();
                }
            });
        };
        return AdminActionItemBlockCtrl;
    }());
    AIP.AdminActionItemBlockCtrl = AdminActionItemBlockCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminActionItemBlockCtrl", AIP.AdminActionItemBlockCtrl);
