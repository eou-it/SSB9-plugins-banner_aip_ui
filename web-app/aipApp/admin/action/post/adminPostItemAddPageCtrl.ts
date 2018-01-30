/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;


module AIP {
    interface IAdminPostItemAddPageCtrl {
        validateInput(): boolean;

        cancel(): void;

        save(): void;

        saveErrorCallback(message: string): void;

        setTimezone(timezone:any): void;
    }

    interface IActionItemAddPageScope {
        vm: AdminPostItemAddPageCtrl;
    }

    export class AdminPostItemAddPageCtrl implements IAdminPostItemAddPageCtrl {
        $inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionService", "$uibModal", "APP_ROOT", "datePicker"];
        $scope;
        $uibModal;
        status: [AIP.IStatus];
        folders: [AIP.IFolder];
        groupList: [AIP.IGroup];
        actionItemList: [AIP.IGroupActionItem];

        populationList: [AIP.IPopulation];
        postActionItemInfo: AIP.IPostActionItemParam | any;
        errorMessage: any;
        adminActionService: AIP.AdminActionService;
        spinnerService: AIP.SpinnerService;
        saving: boolean;
        $q: ng.IQService;
        $state;
        $filter;
        selected;
        IsVisible;
        modalResult;
        localeDate;
        localeTimezone;
        postNow:boolean;
        selectedPopulation;
        modalResults;
        itemLength;
        scheduleDate;
        regeneratePopulation: boolean;
        APP_ROOT;
        sendTime;
        modalInstance;
        $timeout;
        localeTime;
        timezone;
        timezones;
        defaultTimeZone;
        showTimezoneIcon;

        constructor($scope: IActionItemAddPageScope, $q: ng.IQService, $state, $uibModal, $filter, $timeout,
                    SpinnerService: AIP.SpinnerService, APP_ROOT, AdminActionService: AIP.AdminActionService) {
            $scope.vm = this;
            this.$q = $q;
            this.$scope = $scope;
            this.$state = $state;
            this.$filter = $filter;
            this.$uibModal = $uibModal;
            this.modalInstance=null;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.saving = false;
            this.IsVisible=false;
            this.localeDate={};
            this.localeTimezone={};
            this.selected = {};
            this.localeTime={};
            this.modalResult = {};
            this.modalResults = [];
            this.regeneratePopulation = false;
            this.itemLength=0;
            this.sendTime={};
            this.scheduleDate=null;
            this.postNow=true;
            this.showTimezoneIcon = true;
            this.selectedPopulation = {};
            this.APP_ROOT = APP_ROOT;
            this.errorMessage = {};

            this.init();
        }

        today(){
            this.sendTime = new Date();
            this.sendTime.setMinutes(Math.ceil(this.sendTime.getMinutes() / 30) * 30);
        };


        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            var deferred = this.$q.defer();
            this.postActionItemInfo = {};


            allPromises.push(
                this.adminActionService.getGrouplist()
                    .then((response: AIP.IPostActionItemGroupResponse) => {
                        this.groupList = response.data;
                        var postActionItemGroup: any = $("#postActionItemGroup");
                        //this.postActionItemInfo["group"] = [];
                        this.postActionItemInfo.group = this.groupList;

                    })
            );


            allPromises.push(
                this.adminActionService.getPopulationlist()
                    .then((response: AIP.IPostActionItemPopulationResponse) => {
                        this.populationList = response.data;
                        var postActionItemPopulation: any = $("#postActionItemPopulation");
                        this.postActionItemInfo.population = this.populationList;

                    })
            );

            allPromises.push(
                this.adminActionService.getCurrentDateLocale()
                    .then((response) => {
                        this.localeDate = response.data;
                        this.postActionItemInfo.localeDate = this.localeDate.date;
                    })
            );
            allPromises.push(
                this.adminActionService.getCurrentTimeLocale()
                    .then((response:any) => {
                        this.localeTime = response.data.use12HourClock;
                        this.postActionItemInfo.localeTime = this.localeTime;
                        this.today();
                    })
            );
            allPromises.push(

                this.adminActionService.getCurrentTimeZoneLocale()
                    .then((response:any) => {
                    var that=this;
                        this.timezones = response.data.timezones;
                        var timeZoneOffset = new Date().getTimezoneOffset();
                        var offset = "(GMT"+((timeZoneOffset<0? '+':'-')+ this.pad(parseInt(Math.abs(timeZoneOffset/60)), 2)+ ":" + this.pad(Math.abs(timeZoneOffset%60), 2)) + ")";
                        //this.defaultTimeZone = offset;
                        var finalValue=''
                        angular.forEach(this.timezones,function(key,value){
                          var GMTString = key.stringOffset;
                            if (offset===GMTString) {
                                that.setTimezone(key);
                                finalValue = '( '+ key.displayNameWithoutOffset + ' )';
                            }
                        });
                        this.defaultTimeZone = finalValue;
                    })
            );


            this.$q.all(allPromises).then(() => {
                this.spinnerService.showSpinner(false);
            });
        }

        /*ShowPassport(value) {
        this.IsVisible = value == "Y";
                console.log(value)
    }*/
        changedValue() {
            this.itemLength = 0;
            this.modalResult = [];
            var groupId = this.$scope;
            console.log(this.$scope);
            console.log(this.selected.folderName)
            this.adminActionService.getGroupActionItem(this.selected.groupId)

                .then((response: AIP.IPostActionItemResponse) => {
                    this.actionItemList = response.data;
                    var postActionItemGroup: any = $("#ActionItemGroup");
                    this.postActionItemInfo["groupAction"] = [];
                    this.postActionItemInfo.groupAction = this.actionItemList;
                })

        }

        setTime(time){
            this.sendTime = time;
            this.sendTime =this.$filter('date')(this.sendTime, 'HHmm');
            console.log(this.sendTime)
        };


       showTimeZoneList() {
        this.showTimezoneIcon = false;
    };
        pad(number, length){
        var str = "" + number
        while (str.length < length) {
            str = '0'+str
        }
        return str
    }
        setTimezone(timezone) {
            this.timezone = timezone;
            console.log(this.timezone)
        };
        editPage() {
            this.modalInstance = this.$uibModal.open({
                templateUrl: this.APP_ROOT + "admin/action/post/addpost/postAddTemplate.html",
                controller: "PostAddModalCtrl",
                controllerAs: "$ctrl",
                size: "md",
                windowClass: "aip-modal",
                resolve: {
                    actionItemModal: () => {
                        return this.postActionItemInfo.groupAction;
                    },

                    actionGroupModal: () => {
                        return this.selected.groupName;
                    },
                    actionFolderGroupModal: () => {
                        return this.selected.folderName;
                    }

                },

            });
            this.modalInstance.result.then((result) => {
                console.log(result)
                this.itemLength = result.length;
                result.forEach((item, index) => {
                    this.modalResult = item;
                    this.modalResults.push(this.modalResult.actionItemId);
                });

            }, (error) => {
                console.log(error);
            });
        }

        start() {
            console.log(this.postActionItemInfo.startDate)
        }

        validateInput() {
            if (this.saving) {
                return false;
            }
            if (this.itemLength === 0) {
                return false;
            }
            if (!this.postActionItemInfo.name || this.postActionItemInfo.name === null || this.postActionItemInfo.name === "") {

                this.errorMessage.name = "invalid title";
            } else {
                delete this.errorMessage.name;
            }

            if (!this.postActionItemInfo.startDate || this.postActionItemInfo.startDate === null || this.postActionItemInfo.startDate === "") {
                this.errorMessage.startDate = "invalid StartDate";
            } else {
                delete this.errorMessage.startDate;
            }
            if (!this.postActionItemInfo.endDate || this.postActionItemInfo.endDate === null || this.postActionItemInfo.endDate === "") {
                this.errorMessage.endDate = "invalid EndDate";
            } else {
                delete this.errorMessage.endDate;
            }

            if (!this.selected) {
                this.errorMessage.postGroupId = "invalid group";
            } else {
                delete this.errorMessage.postGroupId;
            }
            if (!this.selectedPopulation) {

                this.errorMessage.population = "invalid population";
            } else {
                delete this.errorMessage.population;
            }
            if (!this.modalResult == null) {
                this.errorMessage.success = "invalid actionItem";
            } else {
                delete this.errorMessage.success;
            }
            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            } else {
                return true;
            }
        }

        cancel() {
            this.$state.go("admin-post-list");
        }

        save() {
            this.saving = true;
            if(this.postNow===true){
                this.sendTime=null;
                this.timezone.timezoneId=null;
            }
            this.sendTime =this.$filter("date")(this.sendTime, "HHmm");
            this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow,this.sendTime,this.timezone.timezoneId, this.regeneratePopulation)
                .then((response: AIP.IPostActionItemSaveResponse) => {
                    this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.$state.go("admin-post-list", {noti: notiParams, data: response.data.savedJob.id});
                    } else {
                        this.saveErrorCallback(response.data.message);
                    }
                }, (err) => {
                    this.saving = false;
                    //TODO:: handle error call
                    console.log(err);
                });
        }

        saveErrorCallback(message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        }
    }
}

register("bannerAIP").controller("AdminPostItemAddPageCtrl", AIP.AdminPostItemAddPageCtrl);

