/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
// Mock for Global object
var BreadCrumbAndPageTitle = {draw: function(obj) {
    //console.log(obj);
}};

describe("Config routing", function() {
    var $rootScope, $state, $injector,$location, $httpBackend,
        state = "list";
    beforeEach(function() {
        //inject dependencies into module
        module("banneraip");
        inject(function(_$rootScope_, _$state_, _$injector_, $templateCache, _$location_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $location = _$location_;
            $httpBackend = _$httpBackend_;
            $injector = _$injector_;


            $templateCache.put("../plugins/banner-aip-ui-1.0/aipApp/listItem/itemConfirm/itemConfirmPage.html", "");
            $templateCache.put("../plugins/banner-aip-ui-1.0/aipApp/listItem/listItemPage.html", "");

            // Mock http request
            $httpBackend.when("GET", "aip/checkActionItem")
                .respond({isActionItem: true});
            // bypass common-components' defect code
            //$httpBackend.when("GET", "/dest/i18n/messages-en-us.json")
            //    .respond({});
        });
    });
    describe ("Routing test", function() {
        it("Default state test", function() {
            $location.url("/anyUrl");
            $rootScope.$digest();
            expect($location.$$url).toEqual("/list");
        });
        it("List state test", function() {
            state = "list";
            $state.go(state);
            $rootScope.$digest();
            expect($location.$$url).toEqual("/list");
        })
        it("Confirm state test", function() {
            state = "listConfirm";
            $state.go(state, {itemId:1});
            $rootScope.$digest();
            expect($location.$$url).toEqual("/list/confirm/1");
        })
    });
});

