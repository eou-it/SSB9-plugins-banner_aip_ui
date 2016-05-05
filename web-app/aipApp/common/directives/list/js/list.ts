///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module AIPUI {
    export class AIPListDirective {

        templateUrl: string;
        restrict: string;
        scope:any;
        constructor() {
            this.restrict = "AE";
            this.scope = {
                itemgroup: "=",
                click: "&",
                stylefunction: "&",
                idx: "=",
                showgroupinfo: "&",
                opengroup: "=",
                togglegroup: "&",
                selectedFocus: "="
            }
        }
        compile() {

        }
        link(scope) {
            if (scope.idx === scope.opengroup) {
                scope.isOpen = true;
            } else {
                scope.isOpen = false;
            }
        }
        controller($scope) {
            $scope.getStyle = function(key) {
                return $scope.stylefunction({key: key});
            }
            $scope.selectItem = function(group, row, evt) {
                this.resetSelection();
                this.addSelection(evt.currentTarget);
                $scope.click({groupId: group.groupId, itemId:row.id}).then(function() {
                    setTimeout(function() {
                        $scope.changeFocus(".detail")
                        , 100
                    })
                });
            }
            $scope.openGroup = function(groupId) {
                //TODO::Expand/Collapse group event
                this.resetSelection();
                $scope.togglegroup({state: {groupId:groupId, open:!this.isOpen}});
            }
            $scope.displayGroupInfo = function(groupId, evt) {
                evt.preventDefault()
                evt.stopPropagation();
                this.resetSelection();
                $scope.togglegroup({state: {groupId:groupId, open:true}});
                $scope.isOpen = true;
                $scope.showgroupinfo({groupId:groupId});
            }
            $scope.completedItem = function() {
                var items = $scope.itemgroup.items.filter((_item) => {
                    return _item.state === "aip.status.complete";
                });
                return items;
            }
            $scope.resetSelection = function() {
                $(".list-item").removeClass("selected");
            }
            $scope.addSelection = function(element) {
                $(element).addClass("selected");
            }
            $scope.changeFocus = function(element) {
                $(element).focus();
            }
            $scope.focusing = function(evt) {
                var target = evt.target;
                if(target.className === "accordion-toggle") {
                    $scope.selectedFocus = "header";
                    //$(".aip-list-container .item-group .group-title-text").attr("aria-hidden", "false");
                    //$(".aip-list-container .item-group uib-progressbar").attr("aria-hidden", "false");
                    //$(".aip-list-container .item-group i").attr("aria-hidden", "true");
                } else if(target.className === "group-info fa fa-info-circle") {
                    $scope.selectedFocus = "description";
                //    $(".aip-list-container .item-group .group-title-text").attr("aria-hidden", "true");
                //    $(".aip-list-container .item-group uib-progressbar").attr("aria-hidden", "true");
                //    $(".aip-list-container .item-group i").attr("aria-hidden", "false");
                //} else {
                    $scope.selectedFocus = undefined;
                }
            }
        }
    }
}

register("bannerAIPUI").directive("aipList", AIPUI.AIPListDirective);