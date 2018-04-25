/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
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
        groupTitle: string;
        groupName: string;
        folderName: string;
        folderId: string;
        folderDesc?: string;
        groupActivityDate?: Date|string;
        groupUserId?: string;
        groupDesc?: string;
        groupId: string;
        groupStatus: string;
        postedInd?: string;
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
        group?  : IGroupFolder;
    }

    export interface IAddGroupResponse {
        success: boolean;
        invalidField?: string[];
        message?: string;
        group?: IGroupFolder;
        errors?: string[];
    }

    interface IAdminGroupService {
        getStatus();
        getFolder();
        //getGroupList();
        fetchData(query: string);
        saveGroup(groupInfo:IGroupInfo, edit?: boolean, duplicate?: boolean);
        getGroupDetail(groupId: number|string);
        enableGroupOpen(groupId: number|string);
    }


    enum Status {
        Draft=1, Active=2, Inactive=3
    }

    export class AdminGroupService implements IAdminGroupService{
        static $inject=["$http", "$q", "$filter", "ENDPOINT", "$sce"];
        $http: ng.IHttpService;
        $q: ng.IQService;
        $filter;
        $sce;
        ENDPOINT;
        constructor($http:ng.IHttpService, $q, $filter, ENDPOINT, $sce) {
            this.$http = $http;
            this.$q = $q;
            this.$sce = $sce;
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

        saveGroup(groupInfo:any, edit, duplicate) {
            var params = {
                group: {
                    groupId: groupInfo.id,
                    groupTitle: groupInfo.title,
                    groupName: groupInfo.name,
                    folderId: groupInfo.folder.id,
                    groupStatus: groupInfo.status,
                    groupDesc: groupInfo.description,
                    version: 0
                },
                edit: edit,
                duplicate: duplicate
            };
            var request = this.$http({
                method: "POST",
                data: params,
                url: this.ENDPOINT.admin.createOrUpdateGroup
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
                    method: "GET",
                    url: this.ENDPOINT.admin.openGroup + "?groupId="+groupId
                })
                .then((response:any) => {
                    return <IGroupDetailResponse>response.data;
                }, (err) => {
                    throw new Error(err);
                });
            return request;
        }

        enableGroupOpen(groupId) {
            $("#openGroupBtn").removeAttr("disabled");
            return groupId;
        }

        fetchData (query) {
            var deferred = this.$q.defer();
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
        }

        deleteGroup(status:{groupId:number}) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.deleteGroup,
                data: status
            });
            return request;
        }

        groupPosted(groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.groupPosted+"?groupId=" + groupId
            })
                .then((response: any) => {
                    return response.data;
                }, (err) => {
                    throw new Error(err);
                });
            return request;
        }

        getAssignedActionItemInGroup (groupId) {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.getAssignedActionItemInGroup + "?groupId=" + groupId
            })
                .then((response:any) => {
                    return response.data;
                }, (err) => {
                    throw new Error(err);
                });
            return request;
        }
        getActionItemListForselect() {
            var request = this.$http({
                method: "GET",
                url: this.ENDPOINT.admin.listActionItemForSelect
            })
                .then((response) => {
                return response.data
                }, (err) => {
                throw new Error(err);
            });
            return request;
        }
        updateActionItemGroupAssignment(groupAssignment, groupId) {
            var request = this.$http({
                method: "POST",
                url: this.ENDPOINT.admin.updateActionItemGroupAssignment,
                data: {assignment: groupAssignment, groupId: groupId}
            })
                .then((response) => {
                return response.data;
                }, (err) => {
                throw new Error(err);
                });
            return request;

        }
    }
}

register("bannerAIP").service("AdminGroupService", AIP.AdminGroupService);
