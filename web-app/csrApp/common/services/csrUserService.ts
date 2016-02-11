///<reference path="../../../typings/tsd.d.ts"/>

declare var register;

module CSR {
    interface IuserInfo {
        firstName: string;
        lastName: string;
        preferredName?: string;
        graduateCredit?: number;
        major: string[];
        minor?: string[];
    }
    interface IgetUserResponse {
        data: IuserInfo;
    }
    interface IUserService {
        userInfo: IuserInfo;
        getUserInfo():ng.IHttpPromise<IuserInfo>;
    }

    export class UserService implements IUserService{
        static $inject=["$http", "$q"];
        $http:ng.IHttpService;
        userInfo: IuserInfo;
        constructor($http:ng.IHttpService) {
            this.$http = $http;
            this.getUserInfo().then((response:IgetUserResponse)=> {
                this.userInfo = response.data;
            }, ((err)=> {
                throw new Error(err);
            }));
        }
        getUserInfo() {
            var request = this.$http({
                method: "POST",
                url: "csr/userInfo"
            });
            return request;
        }
    }
}

register("bannercsr").service("CSRUserService", CSR.UserService);