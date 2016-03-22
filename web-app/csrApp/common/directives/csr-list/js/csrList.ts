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
                data: "=",
                itemtitle: "=?",
                description: "=?",
                header: "=",
                dscparams:"=",
                click:"&",
                stylefunction:"&",
                idx: "=",
                showgroupinfo: "&",
                opengroup:"=",
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
            $scope.openConfirm = function(row, evt) {
                this.resetSelection();
                this.addSelection(evt.currentTarget);
                $scope.click({row:row});
            }
            $scope.openGroup = function(idx) {
                //TODO::Expand/Collapse group event
                this.resetSelection();
                $scope.togglegroup({state: {idx:idx, open:!this.isOpen}});
            }
            $scope.displayGroupInfo = function(idx, evt) {
                evt.preventDefault()
                evt.stopPropagation();
                this.resetSelection();
                $scope.togglegroup({state: {idx:idx, open:true}});
                $scope.isOpen = true;
                $scope.showgroupinfo({idx:idx});
            }
            $scope.completedItem = function() {
                var items = $scope.data.filter((_item) => {
                    return _item.state === "Completed";
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