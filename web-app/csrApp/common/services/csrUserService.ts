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
        static $inject=["$http", "$q"];
        $http:ng.IHttpService;
        $q:ng.IQService;
        constructor($http:ng.IHttpService) {
            this.$http = $http;
        }
        getUserInfo() {
            var userRequest =  this.$http({
                method: "POST",
                url: "csr/userInfo"
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