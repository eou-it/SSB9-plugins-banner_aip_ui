///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module CSR {
    export interface IListItem {
        id: number;
        title: string;
        status: string|number;
        folder: string|number;
        date: Date;
        user: string|number;
    }
    export interface IGridData {
        header: {position: number, name: string, title: string, options?: {visible:boolean, isSortable: boolean}}[];
        result: IListItem[];
    }
    export interface IFolder {
        value: string;
        id: string|number;
    }
    export interface IStatus {
        id: string|number;
        value: string;
    }
    interface IAdminGroupService {
        getStatus();
        getFolder();
        getGroupList();
    }
    export class AdminGroupService implements IAdminGroupService{
        static $inject=["$http"];
        $http: ng.IHttpService;
        constructor($http:ng.IHttpService) {
            this.$http = $http;
        }
        getStatus() {
            var request = this.$http({
                method: "POST",
                url: "csr/adminGroupStatus"
            })
                .then((response) => {
                   return <IStatus[]>response.data;
                }, (err) => {
                    throw new Error(err);
            });
            return request;
        }
        getFolder() {
            var request = this.$http({
                method: "POST",
                url: "csr/adminGroupFolder"
            })
                .then((response) => {
                    return <IFolder[]>response.data;
                }, (err) => {
                    throw new Error(err);
            });
            return request;
        }
        getGroupList() {
            var request = this.$http({
                method: "POST",
                url: "csr/adminGroupList"
            })
                .then((response) => {
                    return <IGridData>response.data;
                }, (err) => {
                    throw new Error(err);
            });
            return request;
        }
    }
}

register("bannercsr").service("AdminGroupService", CSR.AdminGroupService);