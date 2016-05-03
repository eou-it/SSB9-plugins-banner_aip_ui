///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupAddPageCtrl = (function () {
        function AdminGroupAddPageCtrl($scope, AdminGroupService, $q, SpinnerService, $state, $filter) {
            this.$inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter"];
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.errorMessage = {};
            $scope.$watch("[vm.status, vm.folders]", function (newVal, oldVal) {
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
            promises.push(this.adminGroupService.getStatus().then(function (status) {
                _this.status = status.map(function (item) {
                    item.value = "aip.status." + item.value;
                    return item;
                });
            }));
            promises.push(this.adminGroupService.getFolder().then(function (folders) {
                var defaultFolder = {
                    id: false,
                    name: _this.$filter("i18n_aip")("aip.admin.group.add.defaultFolder")
                };
                folders.unshift(defaultFolder);
                _this.folders = folders;
            }));
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
                _this.groupInfo.status = _this.status[0];
                _this.groupInfo.folder = _this.folders[0];
            });
        };
        AdminGroupAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.adminGroupService.saveGroup(this.groupInfo)
                .then(function (response) {
                var notiParams = {};
                if (response.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response
                    };
                    _this.$state.go("admin-group-list", { noti: notiParams });
                }
                else {
                    _this.saveErrorCallback(response.invalidField);
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminGroupAddPageCtrl.prototype.cancel = function () {
        };
        AdminGroupAddPageCtrl.prototype.selectStatus = function (item) {
            this.groupInfo.status = item;
        };
        AdminGroupAddPageCtrl.prototype.selectFolder = function (item) {
            this.groupInfo.folder = item;
        };
        AdminGroupAddPageCtrl.prototype.validateInput = function () {
            if (!this.groupInfo.title || this.groupInfo.title === null || this.groupInfo.title === "" || this.groupInfo.title.length > 60) {
                this.errorMessage.title = "invalid title";
            }
            else {
                delete this.errorMessage.title;
            }
            if (!this.groupInfo.folder || this.groupInfo.folder.id === false) {
                this.errorMessage.folder = "invalid folder";
            }
            else {
                delete this.errorMessage.folder;
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        AdminGroupAddPageCtrl.prototype.saveErrorCallback = function (invalidFields) {
            var _this = this;
            var message = this.$filter("i18n_aip")("aip.admin.group.add.error.blank");
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
            });
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return AdminGroupAddPageCtrl;
    })();
    AIP.AdminGroupAddPageCtrl = AdminGroupAddPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupAddPageCtrl", AIP.AdminGroupAddPageCtrl);
//# sourceMappingURL=adminGroupAddPageCtrl.js.map