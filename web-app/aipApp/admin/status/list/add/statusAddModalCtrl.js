/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var StatusAddModalCtrl = (function () {
        function StatusAddModalCtrl($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT; //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.statusModel = {
                title: "",
                block: false
            };
            this.errorMessage = {};
        }
        StatusAddModalCtrl.prototype.statusSave = function () {
            var _this = this;
            this.adminActionStatusService.saveStatus(this.statusModel)
                .then(function (response) {
                if (response.data.success) {
                    console.log(response.data);
                    _this.$uibModalInstance.close(response.data);
                }
                else {
                    //this.$uibModalInstance.dismiss();
                    _this.saveErrorCallback(response.data.message);
                }
            }, function (error) {
                console.log(error);
                _this.$uibModalInstance.dismiss(error);
            });
        };
        StatusAddModalCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        StatusAddModalCtrl.prototype.validate = function () {
            if (this.statusModel.title.length === 0 || this.statusModel.title.length > 30) {
                delete this.errorMessage.title;
                console.log(delete this.errorMessage.title);
            }
            return Object.keys(this.errorMessage).length <= 0;
        };
        StatusAddModalCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return StatusAddModalCtrl;
    }());
    AIP.StatusAddModalCtrl = StatusAddModalCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("StatusAddModalCtrl", AIP.StatusAddModalCtrl);
