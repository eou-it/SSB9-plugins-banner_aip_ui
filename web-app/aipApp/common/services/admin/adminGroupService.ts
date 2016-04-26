///<reference path="../../../../typings/tsd.d.ts"/>

declare var register;

module AIP {
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
        static $inject=["$http", "ENDPOINT"];
        $http: ng.IHttpService;
        ENDPOINT;
        constructor($http:ng.IHttpService, ENDPOINT) {
            this.$http = $http;
            this.ENDPOINT = ENDPOINT;
        }
        getStatus() {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.groupStatus
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
                url: this.ENDPOINT.admin.groupFolder
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
                url: this.ENDPOINT.admin.groupList
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

register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);