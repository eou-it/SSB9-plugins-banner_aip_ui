///<reference path="../../../../../typings/tsd.d.ts"/>

declare var register;

module CSRUI {
    export class CSRListDirective {

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
                togglegroup: "&"
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
                $scope.click({groupId: group.groupId, itemId:row.id});
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
                    return _item.state === "csr.status.complete";
                });
                return items;
            }
            $scope.resetSelection = function() {
                $(".list-item").removeClass("selected");
            }
            $scope.addSelection = function(element) {
                $(element).addClass("selected");
            }
        }

    }
}

register("bannercsrui").directive("csrList", CSRUI.CSRListDirective);