///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {
    export interface IUserInfo {
        firstName: string;
        lastName: string;
        fullName: string;
        graduateCredit?: number;
        major?: string[];
        minor?: string[];
    }
    interface IGetUserResponse {
        data: IUserInfo;
    }
    interface IUserService {
        //getUserInfo():ng.IHttpPromise<IUserInfo>;
    }

    export class UserService implements IUserService{
        static $inject=["$http", "$q", "APP_PATH"];
        $http:ng.IHttpService;
        $q:ng.IQService;
        APP_PATH;
        constructor($http:ng.IHttpService, $q, APP_PATH) {
            this.$http = $http;
            this.APP_PATH = APP_PATH;
        }
        getUserInfo() {
            var userRequest =  this.$http({
                method: "POST",
                url: this.APP_PATH + "/csr/userInfo"
            }).then((response:IGetUserResponse) => {
                return response.data;
            }, (err) => {
                throw new Error(err);
            });
            return userRequest;
        }
    }
}

register("bannercsr").service("CSRUserService", CSR.UserService);