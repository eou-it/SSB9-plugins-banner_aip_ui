/*******************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
var AIP;
(function (AIP) {
    var AdminPostItemAddPageCtrl = (function () {
        function AdminPostItemAddPageCtrl($scope, $q, $state, $filter, $timeout, SpinnerService, AdminActionService) {
            this.$inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionService", "angular.filter"];
            $scope.vm = this;
            this.$q = $q;
            this.$scope = $scope;
            this.$state = $state;
            this.$filter = $filter;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.errorMessage = {};
            this.init();
        }
        AdminPostItemAddPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.postActionItemInfo = {};
            allPromises.push(this.adminActionService.getGrouplist()
                .then(function (response) {
                _this.groupList = response.data;
                console.log(_this.groupList);
                var postActionItemGroup = $("#postActionItemGroup");
                _this.postActionItemInfo.group = _this.groupList;
                _this.$timeout(function () {
                    postActionItemGroup.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity,
                        placeholderOption: 'first'
                    });
                }, 50);
            }));
            allPromises.push(this.adminActionService.getPopulationlist()
                .then(function (response) {
                _this.populationList = response.data;
                console.log(_this.groupList);
                var postActionItemPopulation = $("#postActionItemPopulation");
                _this.postActionItemInfo.population = _this.populationList;
                _this.$timeout(function () {
                    postActionItemPopulation.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity
                    });
                }, 50);
            }));
            this.$q.all(allPromises).then(function () {
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminPostItemAddPageCtrl.prototype.changedValue = function (item) {
            var _this = this;
            this.$scope = item.groupId;
            var a = this.$scope;
            console.log(this.$scope);
            this.adminActionService.getGroupActionItem(a)
                .then(function (response) {
                _this.actionItemList = response.data;
                console.log(_this.actionItemList);
                var postActionItemGroup = $("#ActionItemGroup");
                _this.postActionItemInfo.groupAction = _this.actionItemList;
            });
        };
        AdminPostItemAddPageCtrl.prototype.validateInput = function () {
            if (this.saving) {
                return false;
            }
            /*if(!this.actionItemInfo.name || this.actionItemInfo.name === null || this.actionItemInfo.name === "" || this.actionItemInfo.title.name > 300) {
             this.errorMessage.name = "invalid title";
             } else {
             delete this.errorMessage.name;
             }*/
            /* if(!this.postactionItemInfo.folder) {
             this.errorMessage.folder = "invalid folder";
             } else {
             delete this.errorMessage.folder;
             }
             if(!this.postactionItemInfo.description || this.postactionItemInfo.description === null || this.postactionItemInfo.description === "" ) {
             this.errorMessage.description = "invalid description";
             } else {
             delete this.errorMessage.description;
             }
             if(!this.postactionItemInfo.title || this.postactionItemInfo.title === null || this.postactionItemInfo.title === "" || this.postactionItemInfo.title.length > 300) {
             this.errorMessage.title = "invalid title";
             } else {
             delete this.errorMessage.title;
             }
             if(Object.keys(this.errorMessage).length>0) {
             return false;
             } else {
             return true;
             }*/
        };
        AdminPostItemAddPageCtrl.prototype.cancel = function () {
            this.$state.go("admin-action-list");
        };
        AdminPostItemAddPageCtrl.prototype.save = function () {
            var _this = this;
            this.saving = true;
            this.adminActionService.saveActionItem(this.postactionItemInfo)
                .then(function (response) {
                _this.saving = false;
                var notiParams = {};
                if (response.data.success) {
                    notiParams = {
                        notiType: "saveSuccess",
                        data: response.data
                    };
                    _this.$state.go("admin-action-open", { noti: notiParams, data: response.data.newActionItem.id });
                }
                else {
                    _this.saveErrorCallback(response.data.message);
                }
            }, function (err) {
                _this.saving = false;
                //TODO:: handle error call
                console.log(err);
            });
        };
        AdminPostItemAddPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return AdminPostItemAddPageCtrl;
    }());
    AIP.AdminPostItemAddPageCtrl = AdminPostItemAddPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminPostItemAddPageCtrl", AIP.AdminPostItemAddPageCtrl);
