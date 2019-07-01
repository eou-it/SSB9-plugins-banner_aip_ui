/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemAddPageCtrl = /** @class */ (function () {
        function AdminActionItemAddPageCtrl($scope, $rootScope, $q, $state, $filter, $sce, $timeout, $window, SpinnerService, AdminActionService, $location) {
            var _this = this;
            this.$inject = ["$scope", "$rootScope", "$q", "$state", "$filter", "$location", "$sce", "$timeout", "$window", "SpinnerService", "AdminActionService"];
            this.trustAsHtml = function (string) {
                return this.$sce.trustAsHtml(string);
            };
            this.trustActionItemContent = function () {
                this.actionItemInfo.description = this.$sce.trustAsHtml(this.$filter("html")(this.actionItemInfo.description)).toString();
                return this.actionItemInfo.description;
            };
            $scope.vm = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$sce = $sce;
            this.$state = $state;
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.errorMessage = {};
            this.actionItem1 = {};
            this.editMode = false;
            this.existFolder = {};
            this.duplicateGroup = false;
            this.actionItemDataChanged = false;
            this.redirectval = "NoData";
            this.adminActionItemVal = [];
            this.statusList = [];
            this.selectedstatusval = {};
            this.actionItemInitial = {
                id: undefined,
                title: undefined,
                name: undefined,
                status: undefined,
                postedInd: undefined,
                folder: undefined,
                description: undefined
            };
            $window.onbeforeunload = function (event) {
                if (_this.actionItemDataChanged) {
                    return _this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                // reset to default event listener
                $window.onbeforeunload = null;
            };
            this.init();
        }
        AdminActionItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.actionItemInfo = {};
            this.editMode = this.$state.params.isEdit === "true" ? true : false;
            allPromises.push(this.adminActionService.getStatus()
                .then(function (response) {
                _this.status = response.data;
                for (var k = 0; k < _this.status.length; k++) {
                    var values = {
                        "id": _this.status[k].id,
                        "value": _this.status[k].value
                    };
                    _this.statusList.push(values);
                }
                //  this.status.map(item=>item.value=this.$filter("i18n_aip")(item.value));
                _this.status.map(function (item) {
                    item.value = _this.$filter("i18n_aip")("aip.status." + item.value.charAt(0));
                    return item;
                });
                _this.actionItemInfo.status = _this.status[1].value;
                _this.selectedstatusval = _this.status[1];
            }));
            allPromises.push(this.adminActionService.getFolder()
                .then(function (response) {
                _this.folders = response.data;
            }));
            this.$q.all(allPromises).then(function () {
                if (_this.editMode) {
                    _this.adminActionService.getActionItemDetail(_this.$state.params.actionItemId)
                        .then(function (response) {
                        if (response.data) {
                            _this.actionItem1 = response.data.actionItem;
                            _this.actionItemInfo.id = parseInt(_this.actionItem1.actionItemId);
                            _this.actionItemInfo.title = _this.actionItem1.actionItemTitle;
                            _this.actionItemInfo.name = _this.actionItem1.actionItemName;
                            _this.actionItemInfo.status = _this.actionItem1.actionItemStatus;
                            _this.actionItemInfo.postedInd = _this.actionItem1.postedInd === "Y";
                            _this.actionItemInfo.folder = _this.folders.filter(function (item) {
                                return item.id === parseInt(_this.actionItem1.folderId);
                            })[0];
                            _this.actionItemInfo.description = _this.actionItem1.actionItemDesc;
                            _this.actionItemInitial = angular.copy(_this.actionItemInfo);
                            _this.trustActionItemContent();
                        }
                        else {
                            //todo: output error in notification center?
                            console.log("fail");
                        }
                    }, function (err) {
                        //TODO:: handle error call
                        console.log(err);
                    });
                }
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
        AdminActionItemAddPageCtrl.prototype.selectGroupFolder = function (item, index) {
            var _this = this;
            if (this.editMode && (this.existFolder.id !== item.id)) {
                this.duplicateGroup = true;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.ok"), function () {
                    _this.duplicateGroup = true;
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else {
                this.duplicateGroup = false;
            }
        };
        AdminActionItemAddPageCtrl.prototype.selectStatus = function (item, index) {
            this.selectedstatusval = item;
            this.actionItemInfo.status = item.value;
        };
        AdminActionItemAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            if (!this.actionItemInfo.folder) {
                this.errorMessage.folder = "invalid folder";
            }
            else {
                delete this.errorMessage.folder;
            }
            if (!this.actionItemInfo.description || this.actionItemInfo.description === null || this.actionItemInfo.description === "") {
                this.errorMessage.description = "invalid description";
            }
            else {
                delete this.errorMessage.description;
            }
            if (!this.actionItemInfo.title || this.actionItemInfo.title === null || this.actionItemInfo.title === "" || this.actionItemInfo.title.length > 300) {
                this.errorMessage.title = "invalid title";
            }
            else {
                delete this.errorMessage.title;
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        AdminActionItemAddPageCtrl.prototype.cancel = function () {
            this.redirectval = "NoData";
            this.checkchangesDone();
        };
        AdminActionItemAddPageCtrl.prototype.checkchangesDone = function () {
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
                        that.$state.go('admin-action-list');
                    }
                    else {
                        location.href = that.redirectval;
                    }
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else {
                that.$state.go('admin-action-list');
            }
        };
        AdminActionItemAddPageCtrl.prototype.isChanged = function () {
            var changed = false;
            if (this.editMode) {
                var keys = Object.keys(this.actionItemInitial);
                for (var i = 0; i < keys.length; i++) {
                    if (this.actionItemInfo[keys[i]]) {
                        if (keys[i] === "folder") {
                            if (this.actionItemInfo.folder.id !== this.actionItemInitial.folder.id) {
                                changed = true;
                                break;
                            }
                        }
                        else if (this.actionItemInfo[keys[i]] !== this.actionItemInitial[keys[i]]) {
                            changed = true;
                            break;
                        }
                    }
                }
            }
            else {
                if (this.actionItemInfo.name || this.actionItemInfo.title || (this.actionItemInfo.folder && this.actionItemInfo.folder.id) ||
                    this.actionItemInfo.description) {
                    changed = true;
                }
                else if (this.actionItemInfo.status !== "Draft") {
                    changed = true;
                }
            }
            return changed;
        };
        AdminActionItemAddPageCtrl.prototype.checkActionPost = function () {
            var _this = this;
            if (this.editMode) {
                this.adminActionService.checkActionItemPosted(this.actionItemInfo.id)
                    .then(function (response) {
                    if (!_this.actionItemInfo.actionItemPostedStatus && response.posted) {
                        var n = new Notification({
                            message: _this.$filter("i18n_aip")("aip.admin.action.content.edit.posted.warning"),
                            type: "warning"
                        });
                        n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                            notifications.remove(n);
                            _this.save();
                        });
                        n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.no"), function () {
                            notifications.remove(n);
                        });
                        notifications.addNotification(n);
                    }
                    else {
                        _this.save();
                    }
                }, function (err) {
                    var n = new Notification({
                        message: _this.$filter("i18n_aip")(err.message),
                        type: "error"
                    });
                    n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.ok"), function () {
                        notifications.remove(n);
                    });
                    notifications.addNotification(n);
                });
            }
            else {
                this.save();
            }
        };
        AdminActionItemAddPageCtrl.prototype.dataChanged = function () {
            this.actionItemDataChanged = true;
            this.$rootScope.DataChanged = this.actionItemDataChanged;
        };
        AdminActionItemAddPageCtrl.prototype.actionInfoValues = function () {
            var modifiedStatus;
            if (this.editMode) {
                for (var k = 0; k < this.status.length; k++) {
                    if (this.status[k].value === this.actionItemInfo.status) {
                        this.selectedstatusval = this.status[k];
                    }
                }
            }
            for (var i = 0; i < this.statusList.length; i++) {
                if (this.selectedstatusval.id === this.statusList[i].id) {
                    modifiedStatus = this.statusList[i].value;
                }
            }
            var values = {
                "folder": this.actionItemInfo.folder,
                "name": this.actionItemInfo.name,
                "postedInd": this.actionItemInfo.postedInd,
                "id": this.actionItemInfo.id,
                "status": modifiedStatus,
                "title": this.actionItemInfo.title,
                "description": this.actionItemInfo.description
            };
            this.adminActionItemVal.push(values);
        };
        AdminActionItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.actionInfoValues();
            if (this.editMode) {
                this.adminActionService.editActionItems(this.adminActionItemVal[0])
                    .then(function (response) {
                    _this.saving = false;
                    if (response.data.success) {
                        var notiParams = {};
                        notiParams = {
                            notiType: "editSuccess",
                            data: response.data
                        };
                        _this.actionItemDataChanged = false;
                        _this.$rootScope.DataChanged = false;
                        _this.$state.go("admin-action-open", {
                            noti: notiParams,
                            actionItemId: response.data.updatedActionItem.id
                        });
                    }
                    else {
                        _this.saveErrorCallback(response.data.message);
                    }
                }, function (err) {
                    _this.saving = false;
                    //TODO:: handle error call
                    console.log(err);
                });
            }
            else {
                this.adminActionService.saveActionItem(this.adminActionItemVal[0])
                    .then(function (response) {
                    console.log("Success");
                    _this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        _this.actionItemDataChanged = false;
                        _this.$rootScope.DataChanged = false;
                        _this.$state.go("admin-action-open", {
                            noti: notiParams,
                            actionItemId: response.data.newActionItem.id
                        });
                    }
                    else {
                        _this.saveErrorCallback(response.data.message);
                    }
                }, function (err) {
                    _this.saving = false;
                    //TODO:: handle error call
                    console.log(err);
                });
            }
        };
        AdminActionItemAddPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return AdminActionItemAddPageCtrl;
    }());
    AIP.AdminActionItemAddPageCtrl = AdminActionItemAddPageCtrl;
})(AIP || (AIP = {}));
angular.module("bannerAIP").controller("AdminActionItemAddPageCtrl", AIP.AdminActionItemAddPageCtrl);
