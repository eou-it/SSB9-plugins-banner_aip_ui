/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
            var previousLink = document.referrer;
            var isLoginPage = previousLink.toLowerCase().indexOf("login") != -1;
            if (isLoginPage) {
                history.go(-2);
            }
            else {
                history.go(-1);
            }
        };
        ItemInformCtrl.prototype.closeDialog = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        return ItemInformCtrl;
    }());
    AIP.ItemInformCtrl = ItemInformCtrl;
})(AIP || (AIP = {}));
register("bannerCommonAIP").controller("ItemInformCtrl", AIP.ItemInformCtrl);
