///<reference path="../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var SelectionType;
    (function (SelectionType) {
        SelectionType[SelectionType["Group"] = 0] = "Group";
        SelectionType[SelectionType["ActionItem"] = 1] = "ActionItem";
    })(SelectionType || (SelectionType = {}));
    var ItemListViewService = (function () {
        function ItemListViewService($http, APP_PATH) {
            this.$http = $http;
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
                var data = response.data[0];
                return {
                    type: selectType,
                    groupId: groupId,
                    info: {
                        content: data.text,
                        type: "doc",
                        id: data.actionItemId || data.groupId,
                        detailId: data.id
                    }
                };
            }, function (err) {
                throw new Error(err);
            });
            return request;
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
        ItemListViewService.$inject = ["$http", "APP_PATH"];
        return ItemListViewService;
    })();
    AIP.ItemListViewService = ItemListViewService;
})(AIP || (AIP = {}));
register("bannerAIP").service("ItemListViewService", AIP.ItemListViewService);
//# sourceMappingURL=itemListViewService.js.map