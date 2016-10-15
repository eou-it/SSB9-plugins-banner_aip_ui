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
                method: "POST",
                url: this.APP_PATH + "/aip/detailInfo",
                data: { type: selectType, groupId: groupId, actionItemId: actionItemId }
            })
                .then(function (response) {
                var data = (selectType === "group") ? response.data[0] : response.data;
                return {
                    type: selectType,
                    groupId: groupId,
                    info: {
                        content: data.text,
                        type: "doc",
                        id: data.actionItemId,
                        templateId: data.actionItemTemplateId,
                        detailId: data.id
                    }
                };
            }, function (err) {
                throw new Error(err);
            });
            return request;
        };
        ItemListViewService.prototype.getPagebuilderPage = function (id, actionItemId) {
            var _this = this;
            var defer = this.$q.defer();
            var request = this.$http({
                method: "GET",
                url: this.APP_PATH + "/aipPageBuilder/page?id=" + id
            })
                .then(function (response) {
                var data = response.data;
                $.ajax({
                    url: _this.APP_PATH + "/aipPageBuilder/pageScript?id=" + id + "&actionItemId:" + actionItemId,
                    dataType: 'script',
                    success: function () {
                        angular.module("BannerOnAngular").controller("CustomPageController_" + data.pageName, eval("CustomPageController_" + data.pageName));
                        params = { action: "page", controller: "customPage", id: data.pageName, actionItemId: actionItemId, saved: false };
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
            //            _item.state = "csr.user.list.item.state.complete";
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
//# sourceMappingURL=itemListViewService.js.map