///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;


module AIP {

    export class AdminActionItemAddPageCtrl {
        $inject = ["$scope", "$q", "$state", "$filter", "SpinnerService", "AdminActionService" ];
        status;
        folders;
        actionItemInfo;
        errorMessage;
        adminActionService;
        spinnerService;
        $q;
        $state;
        $filter;
        constructor($scope, $q, $state, $filter, SpinnerService, AdminActionService) {
            $scope.vm = this;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.errorMessage = {};
            this.init();
        }

        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.actionItemInfo = {};
            allPromises.push(
                this.adminActionService.getStatus()
                    .then((response) => {
                        this.status = response.data;
                        var actionItemStatus:any = $("#actionItemStatus");
                        this.actionItemInfo.status = this.status[0].id;
                        actionItemStatus.select2({
                            width: "25em",
                            minimumResultsForSearch: Infinity,
                            placeholderOption: "first"
                        });
                        //TODO: find better and proper way to set defalut value in SELECT2 - current one is just dom object hack.
                        $(".actionItemStatus .select2-container.actionItemSelect .select2-chosen")[0].innerHTML = this.$filter("i18n_aip")(this.status[0].value);
                    })
            );
            allPromises.push(
                this.adminActionService.getFolder()
                    .then((response) => {
                        this.folders = response.data;
                        var actionItemFolder:any = $("#actionItemFolder");
                        actionItemFolder.select2( {
                            width: "25em",
                            minimumResultsForSearch:Infinity,
                            placeholderOption: "first"
                        });
                    })
            );
            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
        }
        validateInput() {
            if(!this.actionItemInfo.title || this.actionItemInfo.title === null || this.actionItemInfo.title === "" || this.actionItemInfo.title.length > 300) {
                this.errorMessage.title = "invalid title";
            } else {
                delete this.errorMessage.title;
            }
            if(!this.actionItemInfo.folder) {
                this.errorMessage.folder = "invalid folder";
            } else {
                delete this.errorMessage.folder;
            }
            if(!this.actionItemInfo.description || this.actionItemInfo.description === null || this.actionItemInfo.description === "" ) {
                this.errorMessage.description = "invalid description";
            } else {
                delete this.errorMessage.description;
            }
            if(Object.keys(this.errorMessage).length>0) {
                return false;
            } else {
                return true;
            }
        }
        cancel() {
            this.$state.go("admin-action-add");
        }
        save() {
            this.adminActionService.saveActionItem(this.actionItemInfo)
                .then((response) => {
                    var notiParams = {};
                    if(response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        // this.$state.go("admin-group-open", {noti: notiParams, grp: response.newGroup[0].groupId});
                    } else {
                        this.saveErrorCallback(response.invalidField, response.errors);
                    }
                }, (err) => {
                    //TODO:: handle error call
                    console.log(err);
                });
        }
        saveErrorCallback(invalidFields, errors) {
            //todo: iterate through errors given back through contraints
            /*
             errors.forEach( function(e, i) {
             message += (e[i]);
             });
             */
            var message = this.$filter("i18n_aip")("aip.admin.group.add.error.blank")
            if (errors != null) {
                message = errors[0]
            }

            angular.forEach(invalidFields, (field) => {
                if(field === "group status") {
                    message += "</br>" + this.$filter("i18n_aip")("admin.group.add.error.noStatus");
                }
                if(field === "folder") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noFolder");
                }
                if(field === "group title") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noTitle");
                }
                if(field === "group description") {
                    message += "</br>" + this.$filter("i18n_aip")("aip.admin.group.add.error.noDesc");
                }
            });
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }
    }
}

register("bannerAIP").controller("AdminActionItemAddPageCtrl", AIP.AdminActionItemAddPageCtrl);