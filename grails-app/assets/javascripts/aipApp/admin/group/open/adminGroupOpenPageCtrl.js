/*******************************************************************************
 Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupOpenPageCtrl = /** @class */ (function () {
        function AdminGroupOpenPageCtrl($scope, $rootScope, $location, $window, AdminGroupService, $q, SpinnerService, $state, $filter, $sce, $templateRequest, $templateCache, $compile, $timeout, APP_FOLDER_PATH) {
            this.trustHTML = function (txtString) {
                var sanitized = txtString ? this.$sce.trustAsHtml(this.$filter("html")(txtString)) : "";
                return sanitized;
            };
            $scope.vm = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.$window = $window;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.$templateRequest = $templateRequest;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.APP_FOLDER_PATH = APP_FOLDER_PATH;
            this.assignedActionItems = [];
            this.initialAssigned = [];
            this.editMode = false;
            this.selected = [];
            this.allActionItems = [];
            this.originalAssign = [];
            this.saving = false;
            this.groupDetailDefer = null;
            this.actionItemDataChanged = false;
            this.redirectval = "NoData";
            this.init();
        }
        AdminGroupOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupDetailDefer = this.getGroupDetailDefer(this.$state.params.groupId).then(function () {
                if (_this.groupFolder.postedInd == "Y") {
                    $("#title-panel h1").html(_this.groupFolder.groupName + ' ' + _this.$filter("i18n_aip")("aip.admin.group.title.posted"));
                }
                else {
                    $("#title-panel h1").html(_this.groupFolder.groupName);
                }
            }, function (err) {
                console.log(err);
            });
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
            });
            var that = this;
            this.$scope.$on("DetectChanges", function (event, args) {
                if (that.actionItemDataChanged) {
                    that.redirectval = args.state;
                    that.checkchangesDone();
                }
            });
        };
        AdminGroupOpenPageCtrl.prototype.dataChanged = function () {
            this.actionItemDataChanged = true;
            this.$rootScope.DataChanged = this.actionItemDataChanged;
        };
        AdminGroupOpenPageCtrl.prototype.openPanel = function (panelName) {
            var _this = this;
            this.$window.onbeforeunload = null;
            var deferred = this.$q.defer();
            var url = "";
            switch (panelName) {
                case "overview":
                    url = this.APP_FOLDER_PATH + "assets/aipApp/admin/group/open/overview/overview.html";
                    break;
                case "content":
                    url = this.APP_FOLDER_PATH + "assets/aipApp/admin/group/open/content/content.html";
                    break;
                case "edit":
                    url = this.APP_FOLDER_PATH + "assets/aipApp/admin/group/open/edit/edit.html";
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
                    if (_this.groupFolder.postedInd == "Y") {
                        $("#title-panel h1").html(_this.groupFolder.groupName + ' ' + _this.$filter("i18n_aip")("aip.admin.group.title.posted"));
                    }
                    else {
                        $("#title-panel").children()[0].innerHTML = _this.groupFolder.groupTitle;
                    }
                }
            }, function (error) {
                console.log(error);
            });
            //ToDO
            var urlVal = this.$location.absUrl().split('?')[0];
            if (angular.element(document.querySelector('#xe-tab1')).href != urlVal) {
                angular.element(document.querySelector('#xe-tab1')).attr('href', urlVal);
                angular.element(document.querySelector('#xe-tab2')).attr('href', urlVal);
            }
            $(".xe-tab-nav").find('li').removeAttr("tabIndex");
            return deferred.promise;
        };
        AdminGroupOpenPageCtrl.prototype.getGroupDetailDefer = function (id) {
            var _this = this;
            var request = this.adminGroupService.getGroupDetail(id)
                .then(function (response) {
                if (response.group) {
                    _this.groupFolder = response.group;
                }
                else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
            return request;
        };
        AdminGroupOpenPageCtrl.prototype.openOverviewPanel = function () {
            var _this = this;
            this.editMode = false;
            this.selected = [];
            this.assignedActionItems = [];
            this.initialAssigned = [];
            var deferred = this.$q.defer();
            this.groupDetailDefer.then(function (group) {
                deferred.resolve(_this.openPanel("overview"));
            });
            return deferred.promise;
        };
        AdminGroupOpenPageCtrl.prototype.openContentPanel = function () {
            var _this = this;
            this.editMode = false;
            this.assignedActionItems = [];
            this.initialAssigned = [];
            this.allActionItems = [];
            this.selected = [];
            var deferred = this.$q.defer();
            var promises = [];
            this.spinnerService.showSpinner(true);
            promises.push(this.groupDetailDefer);
            promises.push(this.adminGroupService.getAssignedActionItemInGroup(this.groupFolder.groupId ? this.groupFolder.groupId : this.groupFolder)
                .then(function (response) {
                _this.assignedActionItems = response;
                _this.assignedActionItems.sort(function (a, b) {
                    return a.sequenceNumber - b.sequenceNumber;
                });
            }, function (err) {
                _this.assignedActionItems = [];
                _this.initialAssigned = [];
                console.log(err);
            }));
            this.$q.all(promises).then(function () {
                _this.spinnerService.showSpinner(false);
                deferred.resolve(_this.openPanel("content"));
            });
            return deferred.promise;
        };
        AdminGroupOpenPageCtrl.prototype.edit = function () {
            var _this = this;
            this.adminGroupService.getActionItemListForselect()
                .then(function (response) {
                _this.allActionItems = response;
                _this.assignedActionItems.forEach(function (item) {
                    _this.selected[item.sequenceNumber - 1] = _this.allActionItems.filter(function (_item) {
                        if (_item.actionItemId === item.actionItemId) {
                            _item.seq = item.sequenceNumber;
                            return _item;
                        }
                    })[0];
                });
                _this.originalAssign = angular.copy(_this.selected);
                _this.initialAssigned = angular.copy(_this.assignedActionItems);
                _this.editMode = true;
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
        AdminGroupOpenPageCtrl.prototype.isChanged = function () {
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
        AdminGroupOpenPageCtrl.prototype.validateEdit = function (type) {
            var _this = this;
            this.adminGroupService.groupPosted(this.groupFolder.groupId)
                .then(function (response) {
                if (type === "overview") {
                    _this.$state.go("admin-group-edit", { groupId: _this.groupFolder.groupId, isEdit: true });
                }
                else {
                    _this.edit();
                }
            }, function (err) {
                throw new Error(err);
            });
        };
        AdminGroupOpenPageCtrl.prototype.handleNotification = function (noti) {
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
                    $(".groupAddContainer").focus();
                }, 500);
            }
        };
        AdminGroupOpenPageCtrl.prototype.groupFn = function (item) {
            return item.folderName;
        };
        AdminGroupOpenPageCtrl.prototype.goUp = function (item, evt) {
            var preItemIdx = this.assignedActionItems.indexOf(item) - 1;
            var preItem = this.assignedActionItems[preItemIdx];
            this.assignedActionItems[preItemIdx] = item;
            this.assignedActionItems[preItemIdx + 1] = preItem;
            var preSelected = this.selected[preItemIdx];
            this.selected[preItemIdx] = this.selected[preItemIdx + 1];
            this.selected[preItemIdx + 1] = preSelected;
            this.reAssignSeqnumber();
            if (preItemIdx > 0) {
                this.$timeout(function () {
                    evt.currentTarget.focus();
                }, 0);
            }
            else if (preItemIdx === 0) {
                this.$timeout(function () {
                    evt.target.nextElementSibling.focus();
                }, 0);
            }
        };
        AdminGroupOpenPageCtrl.prototype.goDown = function (item, evt) {
            var nextItemIdx = this.assignedActionItems.indexOf(item) + 1;
            if (nextItemIdx === this.selected.length) {
                return;
            }
            var nextItem = this.assignedActionItems[nextItemIdx];
            this.assignedActionItems[nextItemIdx] = item;
            this.assignedActionItems[nextItemIdx - 1] = nextItem;
            var nextSelected = this.selected[nextItemIdx];
            this.selected[nextItemIdx] = this.selected[nextItemIdx - 1];
            this.selected[nextItemIdx - 1] = nextSelected;
            this.reAssignSeqnumber();
            if (nextItemIdx + 1 < this.selected.length) {
                this.$timeout(function () {
                    evt.currentTarget.focus();
                }, 0);
            }
            else if (nextItemIdx + 1 === this.selected.length) {
                this.$timeout(function () {
                    evt.target.previousElementSibling.focus();
                }, 0);
            }
        };
        AdminGroupOpenPageCtrl.prototype.reAssignSeqnumber = function () {
            this.selected.map(function (item, index) {
                item.seq = index + 1;
                return item;
            });
            this.assignedActionItems.map(function (item, index) {
                item.sequenceNumber = index + 1;
                return item;
            });
        };
        AdminGroupOpenPageCtrl.prototype.delete = function (item) {
            var itemIdx = this.assignedActionItems.indexOf(item);
            this.assignedActionItems.splice(itemIdx, 1);
            this.selected.splice(itemIdx, 1);
            this.reAssignSeqnumber();
        };
        AdminGroupOpenPageCtrl.prototype.addNew = function () {
            this.assignedActionItems.push({});
            this.selected.push({});
        };
        AdminGroupOpenPageCtrl.prototype.selectActionItem = function (item, index) {
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
            if (!this.selected[index].actionItemId) {
                item.seq = index + 1;
                this.selected[index] = item;
            }
            this.selected = this.selected.filter(function (item, idx) {
                return true;
            });
            this.reAssignSeqnumber();
        };
        AdminGroupOpenPageCtrl.prototype.selectFilter = function (item, index, all) {
            var exist = this.assignedActionItems.filter(function (_item) {
                return item.actionItemId === _item.actionItemId;
            });
            if (exist.length > 0) {
                return false;
            }
            return true;
        };
        AdminGroupOpenPageCtrl.prototype.validateInput = function () {
            var validation = true;
            var unassigned = this.selected.filter(function (item) {
                return !item.actionItemId;
            });
            if (this.isEqual(this.selected, this.originalAssign)) {
                validation = false;
            }
            if (unassigned.length !== 0) {
                validation = false;
            }
            return validation;
        };
        AdminGroupOpenPageCtrl.prototype.validateAddInput = function () {
            var notSelected = this.selected.filter(function (item) {
                return !item.actionItemId;
            });
            if (notSelected.length === 0 && this.allActionItems.length !== this.selected.length && !this.saving) {
                return true;
            }
            return false;
        };
        AdminGroupOpenPageCtrl.prototype.cancel = function () {
            this.redirectval = "NoData";
            this.checkchangesDone();
        };
        AdminGroupOpenPageCtrl.prototype.checkchangesDone = function () {
            var that = this;
            if (that.actionItemDataChanged) {
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
                    if (that.redirectval === "NoData") {
                        that.editMode = false;
                        that.saving = false;
                        that.openContentPanel();
                    }
                    else {
                        location.href = that.redirectval;
                    }
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else {
                that.editMode = false;
                that.saving = false;
                that.openContentPanel();
            }
        };
        AdminGroupOpenPageCtrl.prototype.isEqual = function (item1, item2) {
            var item1Properties = item1.map(function (item) {
                return [item.actionItemId, item.folderId, item.seq];
            });
            var item2Properties = item2.map(function (item) {
                return [item.actionItemId, item.folderId, item.seq];
            });
            if (angular.equals(item1Properties, item2Properties)) {
                return true;
            }
            return false;
        };
        AdminGroupOpenPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.adminGroupService.updateActionItemGroupAssignment(this.selected, this.groupFolder.groupId ? this.groupFolder.groupId : this.groupFolder)
                .then(function (response) {
                _this.saving = false;
                _this.actionItemDataChanged = false;
                _this.$rootScope.DataChanged = false;
                var n = new Notification({
                    message: _this.$filter("i18n_aip")("aip.admin.group.assign.success"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.openContentPanel();
                }, 500);
            }, function (err) {
                _this.saving = false;
                console.log(err);
                var n = new Notification({
                    message: _this.$filter("i18n_aip")("aip.admin.group.assign.fail"),
                    type: "warning"
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.openContentPanel();
                }, 500);
            });
        };
        AdminGroupOpenPageCtrl.prototype.validateSave = function () {
            var _this = this;
            this.adminGroupService.getGroupDetail(this.groupFolder.groupId ? this.groupFolder.groupId : this.groupFolder)
                .then(function (response) {
                if (response.group) {
                    _this.groupFolder = response.group;
                    if (_this.groupFolder.postedInd === "Y") {
                        var n = new Notification({
                            message: _this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                            type: "warning"
                        });
                        n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.no"), function () {
                            notifications.remove(n);
                        });
                        n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                            notifications.remove(n);
                            _this.save();
                        });
                        notifications.addNotification(n);
                    }
                    else {
                        _this.save();
                    }
                }
                else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminGroupOpenPageCtrl.$inject = ["$scope", "$rootScope", "$location", "$window", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$templateRequest", "$templateCache",
            "$compile", "$timeout", "APP_FOLDER_PATH"];
        return AdminGroupOpenPageCtrl;
    }());
    AIP.AdminGroupOpenPageCtrl = AdminGroupOpenPageCtrl;
})(AIP || (AIP = {}));
angular.module("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
