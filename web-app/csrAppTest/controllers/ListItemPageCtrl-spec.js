/**
 * Created by jshin on 2/9/16.
 */
describe("ItemListViewService", function() {
    var $httpBackend;
    beforeEach(module("bannercsr"));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get("$httpBackend");
    }));
    beforeEach(function() {
        module(function($provider) {
            $provider.service("$http", function() {
                this.$http = jasmine.createSpy("$http");
            });

        })
    })
    module("bannercsr");
    beforeEach(inject(function($http) {
        mockHttp = $http;
    }));
    beforeEach(angular.mock.module("bannercsr"));

    var $controller;

    beforeEach(angular.mock.inject(function(_$controller_) {
        $controller = _$controller_;
    }));
    describe("test", function() {
        it("test test case", function() {
            var $scope = {vm:{}};
            var controller = $controller("ListItemPageCtrl", {$scope:$scope});
            $scope.vm.item = 1;
            $scope.vm.item2 = 2;
            expect($scope.vm.item).toBe(1);
        })
    })
})