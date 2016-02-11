/**
 * Created by jshin on 2/9/16.
 */


describe("Jasmine test", function() {
    it("True is always true", function () {
        expect(true).toBe(true);
    });
});

var BreadCrumbAndPageTitle = {draw: function(obj) {
    console.log(obj);
}};

describe("Config and routing", function() {
    var $rootScope, $state, $injector,
        state = "list";
    beforeEach(function() {
        module("bannercsr");
        inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $injector = _$injector_;
            $templateCache.put("../plugins/banner-csr-ui-1.0/csrApp/listItem/itemConfirm/itemConfirmPage.html", "");

        });
    });
    it("should respond to URL", function() {
        expect($state.href(state)).toEqual("#/list");
    })

    it("should resolve data", function() {
        state = "listConfirm";
        $state.go(state, {itemId:1});
        $rootScope.$digest();
        console.log($state.$current);
        expect($state.current.url).toEqual("#/list/confirm/1");
    });
});

