///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/admin/adminItemListViewService.ts"/>

declare var register;

module CSR {

    interface IAdminItemListViewScope extends ng.IScope {
        vm:AdminListItemPageCtrl;
    }

    interface IAdminListItem {
        gridData: IGridData;
        adminItemListViewService: CSR.AdminItemListViewService;
        removeItemCallback(filteredItems:IListItem[]): void
        addNewItem(evt): void;
        updateItems(): void;
    }

    export class AdminListItemPageCtrl implements IAdminListItem {
        static $inject=["$scope", "AdminItemListViewService", "ENDPOINT"];
        public gridData: IGridData;
        listEndPoint:string;
        ENDPOINT;
        adminItemListViewService: CSR.AdminItemListViewService;
        constructor($scope:IAdminItemListViewScope, AdminItemListViewService:CSR.AdminItemListViewService, ENDPOINT) {
            this.adminItemListViewService = AdminItemListViewService;
            this.ENDPOINT = ENDPOINT;
            this.init();
            $scope.vm = this;
            $scope.$watch(()=>{
                return this.adminItemListViewService.gridData;}, (newVal) => {
                this.gridData = newVal;
            });
        }
        init() {
            this.gridData = this.adminItemListViewService.gridData;
        }
        selectAll(filteredItems, chkAll) {
            angular.forEach(filteredItems, (item) => {
                item.selected = chkAll;
            });
        }
        removeItemCallback(filteredItems) {
        }
        addNewItem(evt) {

        }
        updateItems() {
        }
    }
}
register("bannercsr").controller("AdminListItemPageCtrl", CSR.AdminListItemPageCtrl);
