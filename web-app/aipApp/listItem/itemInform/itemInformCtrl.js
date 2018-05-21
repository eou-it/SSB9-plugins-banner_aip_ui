var AIP;
(function (AIP) {
    var ItemInformCtrl = /** @class */ (function () {
        function ItemInformCtrl($scope, $uibModalInstance, $window, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "$window", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.$window = $window;
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
register("bannerCommonAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);
