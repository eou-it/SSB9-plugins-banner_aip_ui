///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminActionItemAddPageCtrl = (function () {
        function AdminActionItemAddPageCtrl($scope, $q, $state, $filter, SpinnerService, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "SpinnerService", "AdminActionService"];
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.errorMessage = {};
            this.init();
        }
        AdminActionItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.actionItemInfo = {};
            allPromises.push(this.adminActionService.getStatus()
                .then(function (response) {
                _this.status = response.data;
                var actionItemStatus = $("#actionItemStatus");
                _this.actionItemInfo.status = _this.status[0].id;
                actionItemStatus.select2({
                    width: "25em",
                    minimumResultsForSearch: Infinity
                });
                //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                $(".actionItemStatus .select2-container.actionItemSelect .select2-chosen")[0].innerHTML = _this.$filter("i18n_aip")(_this.status[0].value);
            }));
            allPromises.push(this.adminActionService.getFolder()
                .then(function (response) {
                _this.folders = response.data;
                var actionItemFolder = $("#actionItemFolder");
                actionItemFolder.select2({
                    width: "25em",
                    minimumResultsForSearch: Infinity,
                    placeholderOption: "first"
                });
            }));
            this.$q.all(allPromises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminActionItemAddPageCtrl.prototype.validateInput = function () {
            if (!this.actionItemInfo.title || this.actionItemInfo.title === null || this.actionItemInfo.title === "" || this.actionItemInfo.title.length > 300) {
                this.errorMessage.title = "invalid title";
            }
            else {
                delete this.errorMessage.title;
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
            this.adminActionService.saveActionItem(this.actionItemInfo)
                .then(function (response) {
                var notiParams = {};
                if (response.data.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response.data
                    };
                    _this.$state.go("admin-action-open", { noti: notiParams, data: response.data.newActionItem.id });
                }
                else {
                    _this.saveErrorCallback(response.data.message);
                }
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
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
//# sourceMappingURL=adminActionItemAddPageCtrl.js.map