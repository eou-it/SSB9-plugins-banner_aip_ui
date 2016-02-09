/**
 * Created by jshin on 2/9/16.
 */
describe("ListItemPageCtrl", function() {
    var $rootScope,
        $scope,
        controller,
        itemListViewService,
        userService;
    beforeEach(function() {
        module('bannercsr');
        inject(function($injector) {
            $rootScope = $injector.get("$rootScope");
            $scope = $rootScope.$new();
            itemListViewService = $injector.get("ItemListViewService");
            userService = $injector.get("CSRUserService");
            controller = $injector.get("$controller")("ListItemPageCtrl", {$scope:$scope,
                $state:undefined, ItemListViewService:itemListViewService, CSRUserService:userService});

        });
    });

    describe("Initialization", function() {
        it("Should instantiate", function() {
            expect($scope.vm.actionItems).toBeDefined();
        });
    })
})