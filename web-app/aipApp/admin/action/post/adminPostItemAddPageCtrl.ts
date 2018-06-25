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

        specialCharacterTranslation():void;

        getProcessedServerDateTimeAndTimezone():void;

    }

    interface IActionItemAddPageScope {
        vm: AdminPostItemAddPageCtrl;
    }

    export class AdminPostItemAddPageCtrl implements IAdminPostItemAddPageCtrl {
        $inject = ["$scope", "$q", "$state", "$filter", "$timeout", "SpinnerService","AdminActionStatusService", "AdminActionService", "$uibModal", "APP_ROOT", "datePicker"];
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
        adminActionStatusService:AIP.AdminActionStatusService;
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
        defaultTimeZoneNameWithOffset;
        showTimezoneIcon;
        actionPost1;
        editMode: boolean;
        postIDvalue;
        selectedActionListVal;
        changeFlag:boolean;
        dirtyFlag:boolean;
        displayDatetimeZone;
        serverinfo;
        appServerDate;
        appServerTime;
        appServerTimeZone;
        processedServerDetails;
        currentBrowserDate;


        constructor($scope: IActionItemAddPageScope, $q: ng.IQService, $state, $uibModal, $filter, $timeout,
                    SpinnerService: AIP.SpinnerService, APP_ROOT,AdminActionStatusService, AdminActionService: AIP.AdminActionService) {
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
            this.adminActionStatusService=AdminActionStatusService;
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
            this.editMode = false;
            this.changeFlag=false;
            this.actionPost1 ={};
            this.postIDvalue=0;
            this.dirtyFlag=false;
            this.selectedActionListVal=[];
            this.displayDatetimeZone=null;
            this.defaultTimeZoneNameWithOffset=null;
            this.serverinfo={};
            this.appServerDate=null;
            this.appServerTime=null;
            this.appServerTimeZone=null;
            this.processedServerDetails={};
            this.currentBrowserDate=null;
            this.init();

        }

        today(){
            this.sendTime = new Date();
            this.sendTime.setMinutes(Math.ceil(this.sendTime.getMinutes() / 30) * 30);
            this.currentBrowserDate = this.$filter('date')(this.sendTime, this.$filter("i18n_aip")("default.date.format"));

        };

        init() {
            this.spinnerService.showSpinner(true);
            var allPromises = [];
            this.postActionItemInfo = {};
            this.editMode = this.$state.params.isEdit==="true" ? true : false;
            this.postIDvalue=this.$state.params.postIdval;

            allPromises.push(
                this.adminActionService.getGrouplist()
                    .then((response: AIP.IPostActionItemGroupResponse) => {
                        this.groupList = response.data;
                        this.postActionItemInfo.group = this.groupList;

                    })
            );

            allPromises.push(
                this.adminActionService.getPopulationlist()
                    .then((response: AIP.IPostActionItemPopulationResponse) => {
                        this.populationList = response.data;
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
                        var finalValue=''
                        var timeZone=''
                        angular.forEach(this.timezones,function(key,value){
                          var GMTString = key.stringOffset;
                            if (offset===GMTString) {
                                that.setTimezone(key);
                                finalValue = '( '+ key.displayNameWithoutOffset + ' )';
                                timeZone =key.stringOffset+' '+key.timezoneId;
                            }
                        });
                        this.defaultTimeZoneNameWithOffset = timeZone;
                        this.defaultTimeZone = finalValue;

                    })
            );


            this.$q.all(allPromises).then(() => {

                if (this.editMode) {
                    this.adminActionService.getJobDetails(this.$state.params.postIdval)
                        .then((response) => {
                            if(response) {

                                this.$scope.group={};
                                this.$scope.population={};
                                this.actionPost1=response;
                                this.postActionItemInfo.postId = this.actionPost1.postingId
                                this.postActionItemInfo.name = this.actionPost1.postingName
                                this.specialCharacterTranslation();

                                for ( var i=0; i<this.postActionItemInfo.group.length; i++)
                                {
                                    if (this.postActionItemInfo.group[i].groupName === this.actionPost1.groupName)
                                    {
                                        this.$scope.group = this.postActionItemInfo.group[i]
                                    }
                                }

                                for ( var k=0; k<this.postActionItemInfo.population.length; k++)
                                {
                                    if (this.postActionItemInfo.population[k].name === this.actionPost1.postingPopulation)
                                    {
                                        this.$scope.population = this.postActionItemInfo.population[k]
                                    }
                                }

                                this.selected= this.$scope.group;
                                this.selectedPopulation =   this.$scope.population;
                                this.postActionItemInfo.groupName = this.actionPost1.groupName;
                                this.postActionItemInfo.displayStartDate = this.actionPost1.postingDisplayStartDate;
                                this.postActionItemInfo.displayEndDate =  this.actionPost1.postingDisplayEndDate;
                                this.postActionItemInfo.scheduledStartDate = this.actionPost1.postingDisplayDateTime;


                                this.postNow = false;
                                this.regeneratePopulation=this.actionPost1.populationRegenerateIndicator;
                                this.sendTime=this.actionPost1.postingDisplayTime;
                                this.defaultTimeZone =this.actionPost1.postingTimeZone;

                                this.appServerDate=this.actionPost1.postingScheduleDateTime;
                                this.appServerTime=this.actionPost1.scheduledStartTime;
                                this.appServerTimeZone=this.actionPost1.timezoneStringOffset.timezoneId;

                                this.changedValue();

                                this.adminActionStatusService.getActionItemsById(this.$state.params.postIdval)
                                    .then((response) => {
                                        this.selectedActionListVal=response.data;
                                        this.itemLength = this.selectedActionListVal.length;
                                        this.selectedActionListVal.forEach((item, index) => {
                                            this.modalResult = item;
                                            this.modalResults.push(this.modalResult.actionItemId);
                                        });

                                    });

                            } else {
                                //todo: output error in notification center?
                                console.log("fail");
                            }
                        }, (err) => {
                            //TODO:: handle error call
                            console.log(err);
                        })

                }
                else{
                    this.getProcessedServerDateTimeAndTimezone()
                }
                this.spinnerService.showSpinner(false);
            });
        }

        specialCharacterTranslation()
        {
            for (var j=0;j<this.postActionItemInfo.population.length;j++)
            {
                if (this.postActionItemInfo.population[j].name.indexOf('&amp;') > -1 )
                {
                    this.postActionItemInfo.population[j].name=this.postActionItemInfo.population[j].name.replace("&amp;", "&");
                }
                if (this.postActionItemInfo.population[j].name.indexOf('&quot;') > -1 )
                {
                    this.postActionItemInfo.population[j].name= this.postActionItemInfo.population[j].name.replace("&quot;", "\"");

                }
                if ((this.postActionItemInfo.population[j].name.indexOf('&#039;') > -1)  || (this.postActionItemInfo.population[j].name.indexOf('&#39;') > -1 ))
                {
                    this.postActionItemInfo.population[j].name= this.postActionItemInfo.population[j].name.replace("&#039;", "\'");
                    this.postActionItemInfo.population[j].name= this.postActionItemInfo.population[j].name.replace("&#39;", "\'");
                }
                if (this.postActionItemInfo.population[j].name.indexOf('&lt;') > -1 )
                {
                    this.postActionItemInfo.population[j].name=  this.postActionItemInfo.population[j].name.replace("&lt;", "<");

                }
                if (this.postActionItemInfo.population[j].name.indexOf('&gt;') > -1 )
                {
                    this.postActionItemInfo.population[j].name=this.postActionItemInfo.population[j].name.replace("&gt;", ">");

                }
            }

        }

        changedValue() {

            this.changeFlag=true;
            this.itemLength = 0;
            this.modalResult = [];
            this.adminActionService.getGroupActionItem(this.selected.groupId)

                .then((response: AIP.IPostActionItemResponse) => {
                    this.actionItemList = response.data;
                    this.postActionItemInfo["groupAction"] = [];
                    this.postActionItemInfo.groupAction = this.actionItemList;
                })
        }

        setTime(time){
            this.sendTime = time;
            this.sendTime =this.$filter('date')(this.sendTime, 'HHmm');

        };


       showTimeZoneList() {
        this.showTimezoneIcon = false;
       };

        pad(number, length){
        var str = "" + number;
        while (str.length < length) {
            str = '0'+str
        }
        return str
    }
        setTimezone(timezone)
        {
            this.timezone = timezone;

        };


        getProcessedServerDateTimeAndTimezone()
        {
            var EnteredDate= (this.postActionItemInfo.scheduledStartDate === undefined) ? this.currentBrowserDate : this.postActionItemInfo.scheduledStartDate;
            var EnteredTime=  this.$filter("date")(this.sendTime, "HHmm")

           if( !(this.sendTime instanceof Date)) {

                var timewithmodifier = this.sendTime.split(' ')
                var time=timewithmodifier[0];
                var modifier=timewithmodifier[1];
                var hourmin = time.split(":");
                var hour=hourmin[0];
                var min=hourmin[1];
                if (hour === '12') {
                    hour = '00';
               }
                 if (modifier === 'PM') {
                   hour = parseInt(hour) + 12;
                 }
                EnteredTime = hour + min;
            }

            var userSelectedVal=
            {
                "userEnterDate": EnteredDate,
                "userEnterTime": EnteredTime,
                "userEnterTimeZone":this.timezone.timezoneId
            };

            this.adminActionStatusService.getProcessedServerDateTimeAndTimezone(userSelectedVal)
                .then((response) => {
                    this.processedServerDetails =response.data;
                    this.appServerDate= (this.postActionItemInfo.scheduledStartDate !== undefined) ?  this.processedServerDetails.serverDate:null;
                    this.appServerTime= this.processedServerDetails.serverTime;
                    this.appServerTimeZone=this.processedServerDetails.serverTimeZone;

                });
        }

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
                    },
                    EditMode: () => {
                        return this.editMode
                    },
                    PostId: () => {
                        return this.postIDvalue
                    },
                    selectedActionItemList: () =>{
                        return this.selectedActionListVal
                    },
                    ChangeFlag: () =>{
                        return this.changeFlag
                    }

                }

            });

            this.modalInstance.result.then((result) => {
                this.modalResults = [];
                this.itemLength = result.length;
                result.forEach((item, index) => {
                    this.modalResult = item;
                    this.modalResults.push(this.modalResult.actionItemId);
                });
                if (this.editMode) {
                    this.dirtyFlag = true
                }

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

            if (!this.postActionItemInfo.displayStartDate || this.postActionItemInfo.displayStartDate === null || this.postActionItemInfo.displayStartDate === "") {
                this.errorMessage.startDate = "invalid StartDate";
            } else {
                delete this.errorMessage.startDate;
            }
            if (!this.postActionItemInfo.displayEndDate || this.postActionItemInfo.displayEndDate === null || this.postActionItemInfo.displayEndDate === "") {
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
           if (!this.modalResult) {
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

         checkChanges() {

             var that = this;
             if (that.editMode) {
                 that.dirtyFlag = true
             }
         }

        cancel() {

            var that=this;

            if (that.editMode === true && that.dirtyFlag === true) {

                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.common.action.post.status.edit.warning"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                    that.$state.go("admin-post-list");
                    notifications.remove(n);
                });

                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    that.save();
                    notifications.remove(n);
                });
                notifications.addNotification(n);
            }
            else
            {
                that.$state.go("admin-post-list");
            }
        }


        save() {
            this.saving = true;
            var userSelectedTime=null;
            if(this.postNow===true){

                this.sendTime=null;
                this.timezone.timezoneId=null;
                var CurrentDateTimeDetails = new Date();
                var currentDate = this.$filter('date')(CurrentDateTimeDetails, this.$filter("i18n_aip")("default.date.format"));
                var currentTime = this.$filter('date')(CurrentDateTimeDetails, 'HHmm');
                var CurrentTimeZone= this.defaultTimeZoneNameWithOffset;
                this.displayDatetimeZone=currentDate.toString()+' '+currentTime.toString()+' '+CurrentTimeZone;

            } else {
                if (this.editMode && !(this.sendTime instanceof Date)) {
                    var hourEnd = this.sendTime.indexOf(":");
                    var H = +this.sendTime.substr(0, hourEnd);
                    var h = H % 12 || 12;
                    var hoursStr = h < 10 ? "0" + h : h;
                    userSelectedTime = hoursStr + this.sendTime.substr(hourEnd + 1, 2);
                    this.displayDatetimeZone=this.postActionItemInfo.scheduledStartDate+' '+userSelectedTime+' '+this.timezone.stringOffset+' '+this.timezone.timezoneId;

                } else {
                    userSelectedTime = this.$filter("date")(this.sendTime, "HHmm");
                    this.displayDatetimeZone=this.postActionItemInfo.scheduledStartDate+' '+userSelectedTime+' '+this.timezone.stringOffset+' '+this.timezone.timezoneId;
                }
            }

            this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow,userSelectedTime,this.timezone.timezoneId, this.regeneratePopulation,this.displayDatetimeZone)
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
                        this.sendTime = ''; // reset it to blank
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

