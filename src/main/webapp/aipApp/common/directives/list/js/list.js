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
        };
        AIPListDirective.prototype.controller = function ($scope, $filter, ItemListViewService) {
            if ($scope.idx === $scope.opengroup) {
                $scope.isOpen = true;
            }
            else {
                $scope.isOpen = false;
            }
            var waitForAccordionElements = function () {
                setTimeout(function () {
                    var accordionToggle = document.querySelector('.accordion-toggle');
                    if ($(accordionToggle).length > 0) {
                        /*
                         * Event handler to toggle group & update aria-expanded attribute accordingly.
                         * */
                        var panelHeading = document.querySelectorAll('.panel-heading');
                        $(panelHeading[$scope.idx]).click(function (event) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            if (event.target.className === "group-instructions") {
                                $scope.displayGroupInfo($scope.itemgroup.id, event);
                            }
                            else {
                                $scope.openGroup($scope.itemgroup.id, event);
                            }
                        });
                    }
                    else {
                        waitForAccordionElements();
                    }
                }, 10);
            };
            waitForAccordionElements();
            $scope.getStyle = function (key) {
                return $scope.stylefunction({ key: key });
            };
            $scope.selectItem = function (group, row, evt) {
                this.resetSelection();
                this.addSelection(evt.currentTarget);
                $scope.click({ groupId: group.id, itemId: row.id });
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
                $scope.togglegroup({ state: { groupId: groupId, open: open } });
                $scope.isOpen = open;
            };
            $scope.displayGroupInfo = function (groupId, evt) {
                evt.stopPropagation();
                evt.preventDefault();
                if (params.isResponseModified) {
                    ItemListViewService.saveChangesNotification($scope.displayGroup, $scope, groupId, null);
                }
                else {
                    $scope.displayGroup(groupId);
                }
            };
            $scope.displayGroup = function (groupId) {
                this.resetSelection();
                $scope.togglegroup({ state: { groupId: groupId, open: true } });
                $scope.isOpen = true;
                $scope.showgroupinfo({ groupId: groupId });
                setTimeout(function () {
                    $scope.changeFocus(".detail");
                }, 10);
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
