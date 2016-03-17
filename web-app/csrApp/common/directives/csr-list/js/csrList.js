///<reference path="../../../../../typings/tsd.d.ts"/>
var CSRUI;
(function (CSRUI) {
    var CSRListDirective = (function () {
        function CSRListDirective() {
            this.restrict = "AE";
            this.scope = {
                data: "=",
                itemtitle: "=?",
                description: "=?",
                header: "=",
                dscparams: "=",
                click: "&",
                stylefunction: "&",
                idx: "=",
                showgroupinfo: "&",
                opengroup: "=",
                togglegroup: "&"
            };
        }
        CSRListDirective.prototype.compile = function () {
        };
        CSRListDirective.prototype.link = function (scope) {
            if (scope.idx === scope.opengroup) {
                scope.isOpen = true;
            }
            else {
                scope.isOpen = false;
            }
        };
        CSRListDirective.prototype.controller = function ($scope) {
            $scope.getStyle = function (key) {
                return $scope.stylefunction({ key: key });
            };
            $scope.openConfirm = function (row, evt) {
                this.resetSelection();
                this.addSelection(evt.currentTarget);
                $scope.click({ row: row });
            };
            $scope.openGroup = function (idx) {
                //TODO::Expand/Collapse group event
                this.resetSelection();
                $scope.togglegroup({ state: { idx: idx, open: !this.isOpen } });
            };
            $scope.displayGroupInfo = function (idx, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                this.resetSelection();
                $scope.togglegroup({ state: { idx: idx, open: true } });
                $scope.isOpen = true;
                $scope.showgroupinfo({ idx: idx });
            };
            $scope.completedItem = function () {
                var items = $scope.data.filter(function (_item) {
                    return _item.state === "csr.user.list.item.state.complete";
                });
                return items;
            };
            $scope.resetSelection = function () {
                $(".list-item").removeClass("selected");
            };
            $scope.addSelection = function (element) {
                $(element).addClass("selected");
            };
        };
        return CSRListDirective;
    })();
    CSRUI.CSRListDirective = CSRListDirective;
})(CSRUI || (CSRUI = {}));
register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);
//# sourceMappingURL=csrList.js.map