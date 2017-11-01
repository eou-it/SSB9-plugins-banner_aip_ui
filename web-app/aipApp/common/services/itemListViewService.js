/*********************************************************************************
 Copyright 2017 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var SelectionType;
    (function (SelectionType) {
        SelectionType[SelectionType["Group"] = 0] = "Group";
        SelectionType[SelectionType["ActionItem"] = 1] = "ActionItem";
    })(SelectionType || (SelectionType = {}));
    var ItemListViewService = (function () {
        function ItemListViewService($http, $q, APP_PATH) {
            this.$http = $http;
            this.$q = $q;
            this.APP_PATH = APP_PATH;
        }
        ItemListViewService.prototype.getActionItems = function (userInfo) {
            var request = this.$http({
                method: "POST",
                url: this.APP_PATH + "/aip/actionItems",
                data: userInfo
            })
                .then(function (response) {
                return response.data;
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        ItemListViewService.prototype.getDetailInformation = function (groupId, selectType, actionItemId) {
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aip/detailInfo?searchType=" + selectType + "&groupId=" + groupId + "&actionItemId=" + actionItemId
            })
                .then(function (response) {
                var returnData;
                if (selectType === "group") {
                    returnData = {
                        content: response.data[0].text,
                        type: "doc",
                        id: groupId,
                        templateId: "",
                        detailId: response.data[0].id,
                        title: response.data[0].title
                    };
                }
                else if (selectType === "actionItem") {
                    returnData = {
                        content: response.data.text,
                        type: "doc",
                        id: response.data.id,
                        templateId: response.data.actionItemTemplateId,
                        detailId: response.data.id,
                        title: response.data.title
                    };
                }
                return {
                    type: selectType,
                    groupId: groupId,
                    info: returnData
                };
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        ItemListViewService.prototype.getPagebuilderPage = function (id, actionItemId, groupId) {
            var _this = this;
            var defer = this.$q.defer();
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipPageBuilder/page?id=" + id
            })
                .then(function (response) {
                var data = response.data;
                $.ajax({
                    url: _this.APP_PATH + "/aipPageBuilder/pageScript?id=" + id + "&actionItemId=" + actionItemId + "&groupId=" + groupId,
                    dataType: 'script',
                    success: function () {
                        angular.module("BannerOnAngular").controller(data.controllerId, data.controllerId);
                        params = { action: "page", controller: "customPage", id: data.pageName, actionItemId: actionItemId, groupId: groupId, saved: false };
                        defer.resolve(data);
                    },
                    async: true
                });
            }, function (err) {
                throw new Error(err);
            });
            return defer.promise;
        };
        ItemListViewService.prototype.confirmItem = function (id) {
            //TODO: update datbase
            //angular.forEach(this.userItems, (item) => {
            //    angular.forEach(item.items, (_item) => {
            //        if(_item.id == id) {
            //            _item.state = "aip.user.list.item.state.complete";
            //        }
            //    });
            //});
        };
        ItemListViewService.$inject = ["$http", "$q", "APP_PATH"];
        return ItemListViewService;
    }());
    AIP.ItemListViewService = ItemListViewService;
})(AIP || (AIP = {}));
register("bannerAIP").service("ItemListViewService", AIP.ItemListViewService);
