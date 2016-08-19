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

    export interface IGroupFolder {
        id: string|number|boolean;
        folderName: string;
        folderDesc?: string;
        groupActivityDate?: Date|string;
        groupUserId?: string;
        groupDesc?: string;
        groupId: string;
        groupStatus: string;
        version?:number|string;
    }

    export interface IStatus {
        id: string|number;
        value: string;
    }
    export interface IGroupInfo {
        id: string|number;
        title: string;
        status: IStatus;
        folder: number|string;
        description: string;
    }
    export interface IGroupDetailResponse {
        success: string;
        errors? : string[];
        group?  : IGroupInfo;
        folder? : IGroupFolder;
    }

    export interface IAddGroupResponse {
        success: boolean;
        invalidField?: string[];
        message?: string;
        newGroup?: any;
        errors?: string[];
    }

    interface IAdminGroupService {
        getStatus();
        getFolder();
        //getGroupList();
        fetchData(query: string);
        saveGroup(groupInfo:IGroupInfo);
        getGroupDetail(groupId: number|string);
        enableGroupOpen(groupId: number|string);
    }


    enum Status {
        Pending=1, Active=2, Inactive=3
    }

    export class AdminGroupService implements IAdminGroupService{
        static $inject=["$http", "$q", "$filter", "ENDPOINT"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        $filter;
        ENDPOINT;
        constructor($http:ng.IHttpService, $q, $filter, ENDPOINT) {
            this.$http = $http;
            this.$q = $q;
            this.$filter = $filter;
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
        /*
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
        */
        saveGroup(groupInfo:any) {
            var params = {
                groupTitle: groupInfo.title,
                folderId: groupInfo.folder,
                groupStatus: Status[groupInfo.status],
                groupDesc: groupInfo.description,
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

        getGroupDetail(groupId) {
            var request = this.$http({
                    method: "POST",
                    url: this.ENDPOINT.admin.openGroup,
                    data: { groupId: groupId }
                })
                .then((response:any) => {
                    return <IGroupDetailResponse>response.data;
                }, (err) => {
                    throw new Error(err);
                })
            return request;
        }

        enableGroupOpen(groupId) {
            //var selectedGroup = groupId;
            $("#openGroupBtn").removeAttr("disabled");
            return groupId;
        }

        fetchData (query) {
            var deferred = this.$q.defer();
            var url = this.ENDPOINT.admin.groupList + "?" +
                '?searchString=' + (query.searchString || '') +
                '&sortColumnName=' + (query.sortColumnName || 'groupTitle') +
                '&ascending=' + query.ascending +
                '&offset=' + (query.offset || '') +
                '&max=' + (query.max || '');
            var realMax = parseInt(query.max) - parseInt(query.offset);
            var params = {
                filterName: query.searchString||"%",
                sortColumn: query.sortColumnName||"id",
                sortAscending: query.ascending||false,
                max: realMax||"",
                offset: query.offset || 0
            };
            this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.groupList,
                data: params
            }).then((response:any)=> {
                deferred.resolve(response.data);
            }, (data) => {
                deferred.reject(data);
            })

            return deferred.promise;
        };
    }
}

register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);