/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupAddPageCtrl =  (function () {
        function AdminGroupAddPageCtrl($scope, $rootScope, $window, AdminGroupService, $q, SpinnerService, $state, $filter, $sce, $timeout, CKEDITORCONFIG) {
            var _this = this;
            this.$inject = ["$scope", "$rootScope", "$window", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$timeout", "CKEDITORCONFIG"];
            this.trustHTML = function (txtString) {
                var sanitized = txtString ? this.$filter("html")(this.$sce.trustAsHtml(txtString)) : "";
                return sanitized;
            };
            $scope.vm = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.$timeout = $timeout;
            this.ckEditorConfig = CKEDITORCONFIG;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.saving = false;
            this.errorMessage = {};
            this.errorMessage = {};
            this.editMode = false;
            this.existFolder = {};
            this.duplicateGroup = false;
            this.actionItemDataChanged = false;
            this.redirectval = "NoData";
            this.groupval = [];
            this.statusList = [];
            this.selectedstatusval = {};
            this.groupInfoInitial = {
                id: undefined,
                title: undefined,
                name: undefined,
                status: undefined,
                postedInd: undefined,
                folder: undefined,
                description: undefined
            };
            $scope.$watch("[vm.status, vm.folders, vm.groupInfo.folder, vm.groupInfo.status, vm.groupInfo.description]", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            }, true);
            $window.onbeforeunload = function (event) {
                if (_this.isChanged()) {
                    return _this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                // reset to default event listener
                $window.onbeforeunload = null;
            };
            this.init();
        }
        AdminGroupAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupInfo = {};
            this.editMode = this.$state.params.isEdit === "true" ? true : false;
            promises.push(this.adminGroupService.getStatus().then(function (status) {
                for (var k = 0; k < status.length; k++) {
                    var values = {
                        "id": status[k].id,
                        "value": status[k].value
                    };
                    _this.statusList.push(values);
                }
                _this.status = status.map(function (item) {
                    item.value = _this.$filter("i18n_aip")("aip.status." + item.value.charAt(0));
                    return item;
                });
                _this.groupInfo.status = _this.status[0].value;
                _this.selectedstatusval = _this.status[0];
            }));
            promises.push(this.adminGroupService.getFolder().then(function (folders) {
                _this.folders = folders;
            }));
            this.$q.all(promises).then(function () {
                if (_this.editMode) {
                    _this.adminGroupService.getGroupDetail(_this.$state.params.groupId)
                        .then(function (response) {
                        if (response.group) {
                            _this.groupInfo.id = parseInt(response.group.groupId);
                            _this.groupInfo.title = _this.trustHTML(response.group.groupTitle);
                            _this.groupInfo.name = _this.trustHTML(response.group.groupName);
                            _this.groupInfo.status = response.group.groupStatus;
                            _this.groupInfo.postedInd = response.group.postedInd === "Y";
                            _this.groupInfo.folder = _this.folders.filter(function (item) {
                                return item.id === parseInt(response.group.folderId);
                            })[0];
                            _this.existFolder = _this.folders.filter(function (item) {
                                return item.id === parseInt(response.group.folderId);
                            })[0];
                            _this.groupInfo.description = _this.trustHTML(response.group.groupDesc);
                            _this.groupInfoInitial = angular.copy(_this.groupInfo);
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
        AdminGroupAddPageCtrl.prototype.checkGroupPost = function () {
            var _this = this;
            if (this.editMode) {
                this.adminGroupService.groupPosted(this.groupInfo.id)
                    .then(function (response) {
                    if (response.posted) {
                        var n = new Notification({
                            message: _this.$filter("i18n_aip")("aip.admin.group.content.edit.posted.warning"),
                            type: "warning"
                        });
                        if (_this.existFolder.id !== _this.groupInfo.folder.id) {
                            console.log("folder changed");
                            n.set("message", _this.$filter("i18n_aip")("aip.admin.group.content.edit.folder.disable"));
                            n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                                notifications.remove(n);
                            });
                            ;
                        }
                        else {
                            n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.no"), function () {
                                notifications.remove(n);
                            });
                            n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                                notifications.remove(n);
                                _this.save();
                            });
                        }
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
        AdminGroupAddPageCtrl.prototype.groupInfoValues = function () {
            var modifiedStatus;
            if (this.editMode) {
                for (var k = 0; k < this.status.length; k++) {
                    if (this.status[k].value === this.groupInfo.status) {
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
                "folder": this.groupInfo.folder,
                "id": this.groupInfo.id,
                "name": this.groupInfo.name,
                "postedInd": this.groupInfo.postedInd,
                "status": modifiedStatus,
                "title": this.groupInfo.title,
                "description": this.groupInfo.description
            };
            this.groupval.push(values);
        };
        AdminGroupAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.groupInfoValues();
            this.adminGroupService.saveGroup(this.groupval[0], this.editMode, this.duplicateGroup)
                .then(function (response) {
                _this.saving = false;
                _this.actionItemDataChanged = false;
                _this.$rootScope.DataChanged = false;
                var notiParams = {};
                if (response.success) {
                    notiParams = {
                        notiType: _this.editMode ? "editSuccess" : "saveSuccess",
                        data: response.group.groupId
                    };
                    _this.$state.go("admin-group-open", { noti: notiParams, groupId: response.group.groupId });
                }
                else {
                    _this.saveErrorCallback(response.invalidField, response.errors, response.message);
                }
            }, function (err) {
                _this.saving = false;
                var n = new Notification({
                    message: _this.$filter("i18n_aip")(err.message),
                    type: "error"
                });
                n.addPromptAction(_this.$filter("i18n_aip")("aip.common.text.ok"), function () {
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            });
        };
        AdminGroupAddPageCtrl.prototype.dataChanged = function () {
            this.actionItemDataChanged = true;
            this.$rootScope.DataChanged = this.actionItemDataChanged;
        };
        AdminGroupAddPageCtrl.prototype.cancel = function () {
            this.redirectval = "NoData";
            this.checkchangesDone();
        };
        AdminGroupAddPageCtrl.prototype.checkchangesDone = function () {
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
                        that.$state.go("admin-group-list");
                    }
                    else {
                        location.href = that.redirectval;
                    }
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else {
                that.$state.go("admin-group-list");
            }
        };
        AdminGroupAddPageCtrl.prototype.isChanged = function () {
            var changed = false;
            if (this.editMode) {
                var keys = Object.keys(this.groupInfoInitial);
                for (var i = 0; i < keys.length; i++) {
                    if (this.groupInfo[keys[i]]) {
                        if (keys[i] === "folder") {
                            if (this.groupInfo.folder.id !== this.groupInfoInitial.folder.id) {
                                changed = true;
                                break;
                            }
                        }
                        else if (keys[i] === "description") {
                            var dom = document.createElement("DIV"), domInitial = document.createElement("DIV");
                            dom.innerHTML = CKEDITOR.instances.groupDesc.getSnapshot(), domInitial.innerHTML = this.groupInfoInitial[keys[i]];
                            var current = (dom.textContent || dom.innerHTML).replace(/\s\s/g, ""), initial = (domInitial.textContent || domInitial.innerHTML).replace(/\s\s/g, "");
                            if (current.trim() !== initial.trim()) {
                                changed = true;
                                break;
                            }
                        }
                        else if (this.groupInfo[keys[i]] !== this.groupInfoInitial[keys[i]]) {
                            changed = true;
                            break;
                        }
                    }
                }
            }
            else {
                if (this.groupInfo.name || this.groupInfo.title || (this.groupInfo.folder && this.groupInfo.folder.id) || this.groupInfo.description) {
                    changed = true;
                }
                else if (this.groupInfo.status !== "Draft") {
                    changed = true;
                }
            }
            return changed;
        };
        AdminGroupAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            if (!this.groupInfo.title || this.groupInfo.title === null || this.groupInfo.title === "" || this.groupInfo.title.length > 60) {
                this.errorMessage.title = "invalid title";
            }
            else {
                delete this.errorMessage.title;
            }
            if (!this.groupInfo.name || this.groupInfo.name === null || this.groupInfo.name === "" || this.groupInfo.name.length > 60) {
                this.errorMessage.name = "invalid name";
            }
            else {
                delete this.errorMessage.name;
            }
            if (!this.groupInfo.folder) {
                this.errorMessage.folder = "invalid folder";
            }
            else {
                delete this.errorMessage.folder;
            }
            if (!this.groupInfo.description || this.groupInfo.description === null || this.groupInfo.description === "") {
                this.errorMessage.description = "invalid description";
            }
            else {
                delete this.errorMessage.description;
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        AdminGroupAddPageCtrl.prototype.selectGroupFolder = function (item, index) {
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
        AdminGroupAddPageCtrl.prototype.selectStatus = function (item, index) {
            this.selectedstatusval = item;
            this.groupInfo.status = item.value;
        };
        AdminGroupAddPageCtrl.prototype.saveErrorCallback = function (invalidFields, errors, orgMessage) {
            var _this = this;
            //todo: iterate through errors given back through contraints
            var message = this.$filter("i18n_aip")(orgMessage || "aip.admin.group.add.error.blank");
            if (errors != null) {
                message = errors[0];
            }
            angular.forEach(invalidFields, function (field) {
                if (field === "group status") {
                    message += "</br>" + _this.$filter("i18n_aip")("admin.group.add.error.noStatus");
                }
                if (field === "folder") {
                    message += "</br>" + _this.$filter("i18n_aip")("aip.admin.group.add.error.noFolder");
                }
                if (field === "group title") {
                    message += "</br>" + _this.$filter("i18n_aip")("aip.admin.group.add.error.noTitle");
                }
                if (field === "group name") {
                    message += "</br>" + _this.$filter("i18n_aip")("aip.admin.group.add.error.noName");
                }
                if (field === "group description") {
                    message += "</br>" + _this.$filter("i18n_aip")("aip.admin.group.add.error.noDesc");
                }
            });
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.ok"), function () {
                notifications.remove(n);
            });
            notifications.addNotification(n);
        };
        return AdminGroupAddPageCtrl;
    }());
    AIP.AdminGroupAddPageCtrl = AdminGroupAddPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupAddPageCtrl", AIP.AdminGroupAddPageCtrl);
