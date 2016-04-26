///<reference path="../../../../../typings/tsd.d.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPListDirective = (function () {
        function AIPListDirective() {
            this.restrict = "AE";
            this.scope = {
                itemgroup: "=",
                click: "&",
                stylefunction: "&",
                idx: "=",
                showgroupinfo: "&",
                opengroup: "=",
                togglegroup: "&"
            };
        }
        AIPListDirective.prototype.compile = function () {
        };
        AIPListDirective.prototype.link = function (scope) {
            if (scope.idx === scope.opengroup) {
                scope.isOpen = true;
            }
            else {
                scope.isOpen = false;
            }
        };
        AIPListDirective.prototype.controller = function ($scope) {
            $scope.getStyle = function (key) {
                return $scope.stylefunction({ key: key });
            };
            $scope.selectItem = function (group, row, evt) {
                this.resetSelection();
                this.addSelection(evt.currentTarget);
                $scope.click({ groupId: group.groupId, itemId: row.id }).then(function () {
                    setTimeout(function () {
                        $scope.changeFocus(".detail")
                            , 100;
                    });
                });
            };
            $scope.openGroup = function (groupId) {
                //TODO::Expand/Collapse group event
                this.resetSelection();
                $scope.togglegroup({ state: { groupId: groupId, open: !this.isOpen } });
            };
            $scope.displayGroupInfo = function (groupId, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                this.resetSelection();
                $scope.togglegroup({ state: { groupId: groupId, open: true } });
                $scope.isOpen = true;
                $scope.showgroupinfo({ groupId: groupId });
            };
            $scope.completedItem = function () {
                var items = $scope.itemgroup.items.filter(function (_item) {
                    return _item.state === "aip.status.complete";
                });
                return items;
            };
            $scope.resetSelection = function () {
                $(".list-item").removeClass("selected");
            };
            $scope.addSelection = function (element) {
                $(element).addClass("selected");
            };
            $scope.changeFocus = function (element) {
                $(element).focus();
            };
        };
        return AIPListDirective;
    })();
    AIPUI.AIPListDirective = AIPListDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("csrList", AIPUI.AIPListDirective);
//# sourceMappingURL=list.js.map