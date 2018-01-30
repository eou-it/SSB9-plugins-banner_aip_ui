/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
var AIP;
(function (AIP) {
    var ItemInformCtrl = (function () {
        function ItemInformCtrl($scope, $uibModalInstance, $window, ENDPOINT, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "$window", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.$window = $window;
            this.ENDPOINT = ENDPOINT;
            this.APP_ROOT = APP_ROOT;
        }
        ItemInformCtrl.prototype.goAhead = function () {
            this.$uibModalInstance.close();
        };
        ItemInformCtrl.prototype.goBack = function () {
            this.$window.history.back();
        };
        ItemInformCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        return ItemInformCtrl;
    }());
    AIP.ItemInformCtrl = ItemInformCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);
