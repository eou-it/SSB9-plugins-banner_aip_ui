//<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../../common/services/admin/adminActionStatusService.ts"/>
var AIP;
(function (AIP) {
    var StatusAddModalCtrl = (function () {
        function StatusAddModalCtrl($scope, $uibModalInstance, ENDPOINT, AdminActionStatusService, ENDPOINT, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.endPoint = ENDPOINT; //ENDPOINT.admin.actionList
            this.adminActionStatusService = AdminActionStatusService;
            this.APP_ROOT = APP_ROOT;
            this.statusModel = {
                title: "",
                block: false
            };
        }
        StatusAddModalCtrl.prototype.statusSave = function () {
            var _this = this;
            console.log("save click");
            this.adminActionStatusService.saveStatus(this.statusModel)
                .then(function (response) {
                console.log(response.data);
                _this.$uibModalInstance.close(response.data);
            }, function (error) {
                console.log(error);
                _this.$uibModalInstance.dismiss(error);
            });
        };
        StatusAddModalCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        StatusAddModalCtrl.prototype.validate = function () {
            if (this.statusModel.title.length === 0) {
                return false;
            }
            return true;
        };
        return StatusAddModalCtrl;
    }());
    AIP.StatusAddModalCtrl = StatusAddModalCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("StatusAddModalCtrl", AIP.StatusAddModalCtrl);
//# sourceMappingURL=statusAddModalCtrl.js.map