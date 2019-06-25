/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
module AIPUI {
    export function AIPItemDetailDirective($filter) {
        return {
            restrict: "AE",
            transclude: true,
            replace: false,
            scope: {
                data: "=",
                next: "&",
                tolist: "&",
                custompage: "&"
            },
            controller: function ($scope ) {
                $scope.proceed = function () {
                    $scope.next({groupId: this.data.info.detailId, itemId: this.data.info.id});
                };
                $scope.getState = function (id) {
                    $scope.itemstate(id)
                };
                $scope.returnlist = function () {
                    $scope.tolist();
                };
                $scope.nextitem = function () {
                    $scope.next({groupId: this.data.groupId, itemId: this.data.info.id});
                }
            }
        }
    }
    angular.module('bannerAIPUI').directive('aipItemDetail', [ '$filter',AIPItemDetailDirective]);
}

