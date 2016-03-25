///<reference path="../../../typings/tsd.d.ts"/>
var CSR;
(function (CSR) {
    var SelectionType;
    (function (SelectionType) {
        SelectionType[SelectionType["Group"] = 0] = "Group";
        SelectionType[SelectionType["ActionItem"] = 1] = "ActionItem";
    })(SelectionType || (SelectionType = {}));
    var ItemListViewService = (function () {
        function ItemListViewService($http) {
            this.$http = $http;
        }
        ItemListViewService.prototype.getActionItems = function (userInfo) {
            var request = this.$http({
                method: "POST",
                url: "csr/actionItems",
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
                url: "csr/detailInfo",
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
        ItemListViewService.$inject = ["$http"];
        return ItemListViewService;
    })();
    CSR.ItemListViewService = ItemListViewService;
})(CSR || (CSR = {}));
register("bannercsr").service("ItemListViewService", CSR.ItemListViewService);
//# sourceMappingURL=itemListViewService.js.map