/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemAddPageCtrl = /** @class */ (function () {
        function AdminActionItemAddPageCtrl($scope, $q, $state, $filter, $sce, $timeout, SpinnerService, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$sce", "$timeout", "SpinnerService", "AdminActionService"];
            this.trustAsHtml = function (string) {
                return this.$sce.trustAsHtml(string);
            };
            this.trustActionItemContent = function () {
                this.actionItemInfo.description = this.$sce.trustAsHtml(this.$filter("html")(this.actionItemInfo.description)).toString();
                return this.actionItemInfo.description;
            };
            $scope.vm = this;
            this.$q = $q;
            this.$sce = $sce;
            this.$state = $state;
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
                console.log(_this.status);
                angular.forEach(_this.status, function (key, value) {
                    console.log(key);
                    console.log(value);
                    key.value = "aip.status." + key.value.charAt(0);
                    return value;
                });
                _this.actionItemInfo.status = _this.status[0].value;
                console.log(_this.actionItemInfo.status);
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
                            /*this.existFolder = this.folders.filter((item)=> {
                                return item.id === parseInt(this.actionItem1.folderId);
                            })[0];*/
                            _this.actionItemInfo.description = _this.actionItem1.actionItemDesc;
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
            this.actionItemInfo.status = this.$filter("i18n_aip")(item.value);
        };
        AdminActionItemAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            /*if(!this.actionItemInfo.name || this.actionItemInfo.name === null || this.actionItemInfo.name === "" || this.actionItemInfo.title.name > 300) {
                this.errorMessage.name = "invalid title";
            } else {
                delete this.errorMessage.name;
            }*/
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
            this.$state.go("admin-action-list");
        };
        AdminActionItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            if (this.editMode) {
                this.adminActionService.editActionItems(this.actionItemInfo)
                    .then(function (response) {
                    _this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "editSuccess",
                            data: response.data
                        };
                        _this.$state.go("admin-action-open", {
                            noti: notiParams,
                            actionItemId: response.data.updatedActionItem.id,
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
                this.adminActionService.saveActionItem(this.actionItemInfo)
                    .then(function (response) {
                    _this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
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
register("bannerAIP").controller("AdminActionItemAddPageCtrl", AIP.AdminActionItemAddPageCtrl);
