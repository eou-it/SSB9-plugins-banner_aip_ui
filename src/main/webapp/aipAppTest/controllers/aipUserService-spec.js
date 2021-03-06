/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/

// Mock for Global object
var BreadCrumbAndPageTitle = {draw: function(obj) {
}};

describe("AIP User service", function() {
    var $rootScope, $injector,$httpBackend, userService;

    beforeEach(function() {
        //inject dependencies into module
        module("banneraip");
        inject(function(_$rootScope_, _$injector_, _$httpBackend_, AIPUserService) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $injector = _$injector_;
            userService = AIPUserService;
            // Mock http request
            $httpBackend.when("GET", "/aip/checkActionItem").respond({isActionItem: true});
            // bypass common-components' defect code
           // $httpBackend.when("GET", "/dest/i18n/messages-en-us.json")
             //   .respond({});
            $httpBackend.when("POST", "aip/userInfo")
                .respond({
                    data: {
                        firstName: "First",
                        lastName: "Last",
                        preferredName: "Test User",
                        graduateCredit: 121
                    }
                });
        });
    });

    describe ("UserService test", function() {
        //console.log("in test case", userService);
        it("getUserInfo defined", function() {
            expect(userService.getUserInfo).toBeDefined();
            console.log(userService.userInfo);
        });

    });
});

