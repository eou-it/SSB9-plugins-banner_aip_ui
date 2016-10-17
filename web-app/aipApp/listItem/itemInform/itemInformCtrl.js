var AIP;
(function (AIP) {
    var ItemInformCtrl = (function () {
        function ItemInformCtrl($scope, $uibModalInstance, ENDPOINT, APP_ROOT) {
            this.$inject = ["$scope", "$uibModalInstance", "AdminActionStatusService", "ENDPOINT", "APP_ROOT"];
            $scope.vm = this;
            this.$uibModalInstance = $uibModalInstance;
            this.ENDPOINT = ENDPOINT;
            this.APP_ROOT = APP_ROOT;
        }
        ItemInformCtrl.prototype.goAhead = function () {
            console.log("goAhead Clicked");
        };
        ItemInformCtrl.prototype.goBack = function () {
            console.log("goBack Clicked");
        };
        ItemInformCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        return ItemInformCtrl;
    })();
    AIP.ItemInformCtrl = ItemInformCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);
//# sourceMappingURL=itemInformCtrl.js.map