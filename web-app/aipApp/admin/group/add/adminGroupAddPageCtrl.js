/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupAddPageCtrl = (function () {
        function AdminGroupAddPageCtrl($scope, AdminGroupService, $q, SpinnerService, $state, $filter, $sce, $timeout, CKEDITORCONFIG) {
            this.$inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$timeout", "CKEDITORCONFIG"];
            this.trustGroupDesc = function () {
                this.groupInfo.description = this.groupInfo.description ? this.$filter("html")(this.$sce.trustAsHtml(this.groupInfo.description)) : "";
                return this.groupInfo.description;
            };
            $scope.vm = this;
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
            $scope.$watch("[vm.status, vm.folders, vm.groupInfo.folder, vm.groupInfo.status, vm.groupInfo.description]", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.apply();
                }
            }, true);
            this.init();
        }
        AdminGroupAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            this.groupInfo = {};
            this.editMode = this.$state.params.data ? this.$state.params.data.isEdit : false;
            promises.push(this.adminGroupService.getStatus().then(function (status) {
                _this.status = status.map(function (item) {
                    item.value = _this.$filter("i18n_aip")("aip.status." + item.value.charAt(0));
                    return item;
                });
                _this.groupInfo.status = _this.status[0].value;
            }));
            promises.push(this.adminGroupService.getFolder().then(function (folders) {
                _this.folders = folders;
            }));
            this.$q.all(promises).then(function () {
                if (_this.editMode) {
                    _this.adminGroupService.getGroupDetail(_this.$state.params.data.group)
                        .then(function (response) {
                        if (response.group) {
                            _this.groupInfo.id = parseInt(response.group.groupId);
                            _this.groupInfo.title = response.group.groupTitle;
                            _this.groupInfo.name = response.group.groupName;
                            _this.groupInfo.status = response.group.groupStatus;
                            _this.groupInfo.folder = _this.folders.filter(function (item) {
                                return item.id === parseInt(response.group.folderId);
                            })[0];
                            _this.existFolder = _this.folders.filter(function (item) {
                                return item.id === parseInt(response.group.folderId);
                            })[0];
                            _this.groupInfo.description = response.group.groupDesc;
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
                _this.trustGroupDesc();
            });
        };
        AdminGroupAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.adminGroupService.saveGroup(this.groupInfo, this.editMode, this.duplicateGroup)
                .then(function (response) {
                _this.saving = false;
                var notiParams = {};
                if (response.success) {
                    notiParams = {
                        notiType: _this.editMode ? "editSuccess" : "saveSuccess",
                        data: response.group.groupId
                    };
                    _this.$state.go("admin-group-open", { noti: notiParams, data: { group: response.group.groupId } });
                }
                else {
                    _this.saveErrorCallback(response.invalidField, response.errors, response.message);
                }
            }, function (err) {
                _this.saving = false;
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminGroupAddPageCtrl.prototype.cancel = function () {
            this.$state.go("admin-group-list");
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
                    message: this.$filter("i18n_aip")("aip.admin.group.content.edit.duplicate"),
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
            this.groupInfo.status = item.value;
        };
        AdminGroupAddPageCtrl.prototype.saveErrorCallback = function (invalidFields, errors, message) {
            var _this = this;
            //todo: iterate through errors given back through contraints
            /*
            errors.forEach( function(e, i) {
                message += (e[i]);
            });
            */
            var message = this.$filter("i18n_aip")(message || "aip.admin.group.add.error.blank");
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
            notifications.addNotification(n);
        };
        return AdminGroupAddPageCtrl;
    }());
    AIP.AdminGroupAddPageCtrl = AdminGroupAddPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupAddPageCtrl", AIP.AdminGroupAddPageCtrl);
