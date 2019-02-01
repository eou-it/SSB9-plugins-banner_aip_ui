/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../typings/tsd.d.ts"/>
///<reference path="../../../services/itemListViewService.ts"/>
var AIPUI;
(function (AIPUI) {
    var AIPListDirective = /** @class */ (function () {
        function AIPListDirective() {
            this.restrict = "AE";
            this.scope = {
                itemgroup: "=",
                click: "&",
                stylefunction: "&",
                idx: "=",
                showgroupinfo: "&",
                opengroup: "=",
                togglegroup: "&",
                selectedFocus: "&"
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
        AIPListDirective.prototype.controller = function ($scope, $filter, ItemListViewService) {
            $scope.getStyle = function (key) {
                return $scope.stylefunction({ key: key });
            };
            $scope.selectItem = function (group, row, evt) {
                this.resetSelection();
                this.addSelection(evt.currentTarget);
                $scope.click({ groupId: group.id, itemId: row.id }).then(function () {
                    setTimeout(function () {
                        $scope.changeFocus(".detail");
                    }, 100);
                });
            };
            $scope.openGroup = function (groupId) {
                if (params.isResponseModified) {
                    ItemListViewService.saveChangesNotification($scope.expandGroup, $scope, groupId, this.isOpen);
                }
                else {
                    $scope.expandGroup(groupId, this.isOpen);
                }
            };
            $scope.expandGroup = function (groupId, open) {
                this.resetSelection();
                $scope.togglegroup({ state: { groupId: groupId, open: !open } });
            };
            $scope.displayGroupInfo = function (groupId, evt) {
                if (params.isResponseModified) {
                    ItemListViewService.saveChangesNotification($scope.displayGroup, $scope, groupId, evt);
                }
                else {
                    $scope.displayGroup(groupId, evt);
                }
            };
            $scope.displayGroup = function (groupId, evt) {
                evt.stopPropagation();
                evt.preventDefault();
                this.resetSelection();
                $scope.togglegroup({ state: { groupId: groupId, open: true } });
                $scope.isOpen = true;
                $scope.showgroupinfo({ groupId: groupId });
                setTimeout(function () {
                    $scope.changeFocus(".detail");
                }, 100);
            };
            $scope.completedItem = function () {
                var items = $scope.itemgroup.items.filter(function (_item) {
                    return _item.status !== "Pending";
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
            $scope.focusing = function (evt) {
                var target = evt.target;
                if (target.className === "accordion-toggle") {
                    $scope.selectedFocus = "header";
                }
                if (target.className === "group-instructions") {
                    $scope.selectedFocus = "description";
                }
            };
        };
        return AIPListDirective;
    }());
    AIPUI.AIPListDirective = AIPListDirective;
})(AIPUI || (AIPUI = {}));
register("bannerAIPUI").directive("aipList", AIPUI.AIPListDirective);
