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
        ItemListViewService.prototype.getDetailInformation = function (id, selectType) {
            var detailInfo = {};
            //TODO:: get information for group/actionitem from grails controller
            switch (selectType) {
                case "group":
                    detailInfo = {
                        type: SelectionType.Group,
                        id: id,
                        info: {
                            title: "same as group title",
                            content: "Detail instruction/info of group " + id,
                            type: "doc"
                        }
                    };
                    break;
                case "actionItem":
                    detailInfo = {
                        type: SelectionType.ActionItem,
                        id: id,
                        info: {
                            title: "same as action item name",
                            content: "Detail information of action item " + id,
                            type: "doc"
                        }
                    };
                default:
                    break;
            }
            return detailInfo;
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