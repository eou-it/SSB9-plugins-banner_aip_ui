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
        id: string|number|boolean;
        name: string;
        description?: string;
        lastModified?: Date|string;
        lastModifiedBy?: string;
        version?:number|string;
    }
    export interface IStatus {
        id: string|number;
        value: string;
    }
    export interface IGroupInfo {
        title: string;
        status: AIP.IStatus;
        folder: AIP.IFolder;
    }
    export interface IAddGroupResponse {
        success: boolean;
        invalidField?: string[];
        message?: string;
        newGroup?: any;
    }
    interface IAdminGroupService {
        getStatus();
        getFolder();
        getGroupList();
        saveGroup(groupInfo:IGroupInfo);
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
                    //TODO: handle ajax fail in global
                    throw new Error(err);
            });
            return request;
        }
        getFolder() {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.folders
            })
                .then((response) => {
                    return <IFolder[]>response.data;
                }, (err) => {
                    //TODO: handle ajax fail in global
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
                    //TODO: handle ajax fail in global
                    throw new Error(err);
            });
            return request;
        }
        saveGroup(groupInfo:IGroupInfo) {
            var params = {
                groupTitle: groupInfo.title,
                folderId: groupInfo.folder.id,
                groupStatus: this.convertStatusValue(groupInfo.status.value),
                groupDesc: "",
                version: 0
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createGroup
            })
                .then((response) => {
                    return response.data;
                }, (err) => {
                    //TODO: handle ajax fail in global
                    throw new Error(err);
            });
            return request;
        }
        convertStatusValue(value:string) {
            var val = ""
            switch(value) {
                case "aip.status.pending":
                    val = "Pending"
                    break
                case "aip.status.active":
                    val = "Active"
                    break
                case "aip.status.inactive":
                    val = "Inactive"
                    break;
                default:
                    val = "Pending"
                    break;
            }
            return val;
        }
    }
}

register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);