/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
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
                togglegroup: "&",
                selectedFocus: "&"
            };
        }
        AIPListDirective.prototype.compile = function () {
        };
        AIPListDirective.prototype.link = function (scope) {
        };
        AIPListDirective.prototype.controller = function ($scope) {
            if ($scope.idx === $scope.opengroup) {
                $scope.isOpen = true;
            }
            else {
                $scope.isOpen = false;
            }
            setTimeout(function () {
                /*
                * To add aria-expanded attribute to all the groups.
                * True for selected group & false for other groups
                * */
                var selectedGroup = document.querySelectorAll('div[aria-selected=true] .accordion-toggle');
                if ($(selectedGroup[$scope.idx]).length > 0) {
                    $(selectedGroup[$scope.idx]).attr("aria-expanded", "true");
                }
                var otherGroups = document.querySelectorAll('div[aria-selected=false] .accordion-toggle');
                if ($(otherGroups[$scope.idx]).length > 0) {
                    $(otherGroups[$scope.idx]).attr("aria-expanded", "false");
                }
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
            }, 100);
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
            $scope.openGroup = function (groupId, evt) {
                this.resetSelection();
                var accordionToggle = $(evt.currentTarget).find('.accordion-toggle');
                var toggle = this.isOpen;
                $(accordionToggle).attr('aria-expanded', toggle.toString());
                $scope.togglegroup({ state: { groupId: groupId, open: this.isOpen } });
            };
            $scope.displayGroupInfo = function (groupId, evt) {
                event.stopPropagation();
                event.preventDefault();
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
