/*******************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/

///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
declare var register;
declare var Notification:any;
declare var notifications:any;


module AIP {
    interface IAdminPostItemAddPageCtrl {
        validateInput(): boolean;

        cancel(): void;

        save(): void;

        saveErrorCallback(message:string): void;

        setTimezone(timezone:any): void;

        specialCharacterTranslation():void;

        getDefaultTimeZone():void;

        getProcessedServerDateTimeAndTimezone():void;

        timeConversion():void;

    }

    interface IActionItemAddPageScope {
        vm: AdminPostItemAddPageCtrl;
    }

    export class AdminPostItemAddPageCtrl implements IAdminPostItemAddPageCtrl {
        $inject = ["$scope","$rootScope", "$q", "$state", "$filter", "$timeout", "SpinnerService", "AdminActionStatusService", "AdminActionService", "$uibModal", "APP_ROOT", "datePicker"];
        $scope;
        $rootScope;
        $uibModal;
        status:[AIP.IStatus];
        folders:[AIP.IFolder];
        groupList:[AIP.IGroup];
        actionItemList:[AIP.IGroupActionItem];


        populationList:[AIP.IPopulation];
        postActionItemInfo:AIP.IPostActionItemParam | any;
        errorMessage:any;
        adminActionService:AIP.AdminActionService;
        adminActionStatusService:AIP.AdminActionStatusService;
        spinnerService:AIP.SpinnerService;
        saving:boolean;
        $q:ng.IQService;
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
        regeneratePopulation:boolean;
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
        editMode:boolean;
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
        selectedTime;
        enteredDate;
        recurCount:number;
        recurFreqeunecyList:any;
        displayStartDateOffset:number;
        displayEndDateOffset:number;
        recurDisplayEndDate:any;
        recurranceStartDate:any;
        recurranceEndDate:any;
        recurrTime:any;
        recurrEndDate:any;
        showSchedule:boolean;
        showRecurrance:boolean;
        scheduleType:string;
        recDisplayEndDateType:string;
        isDataModified:boolean;
        selectedRecurFrequency:any;
        redirectval:any;
        serverRecurEndDate:any;

        constructor($scope:IActionItemAddPageScope,$rootScope, $q:ng.IQService, $state, $uibModal, $filter, $timeout,
                    SpinnerService:AIP.SpinnerService, APP_ROOT, AdminActionStatusService, AdminActionService:AIP.AdminActionService) {
            $scope.vm = this;
            this.$q = $q;
            this.$scope = $scope;
            this.$rootScope=$rootScope;
            this.$state = $state;
            this.$filter = $filter;
            this.$uibModal = $uibModal;
            this.modalInstance = null;
            this.$timeout = $timeout;
            this.spinnerService = SpinnerService;
            this.adminActionService = AdminActionService;
            this.adminActionStatusService = AdminActionStatusService;
            this.saving = false;
            this.IsVisible = false;
            this.localeDate = {};
            this.localeTimezone = {};
            this.selected = {};
            this.localeTime = {};
            this.modalResult = {};
            this.modalResults = [];
            this.regeneratePopulation = false;
            this.itemLength = 0;
            this.sendTime = {};
            this.scheduleDate = null;
            this.scheduleType = "POSTNOW";
            this.showRecurrance = false;
            this.showSchedule = false;
            this.showTimezoneIcon = true;
            this.selectedPopulation = {};
            this.APP_ROOT = APP_ROOT;
            this.errorMessage = {};
            this.editMode = false;
            this.changeFlag = false;
            this.actionPost1 = {};
            this.postIDvalue = 0;
            this.dirtyFlag = false;
            this.selectedActionListVal = [];
            this.displayDatetimeZone = {};
            this.defaultTimeZoneNameWithOffset = null;
            this.serverinfo = {};
            this.appServerDate = null;
            this.appServerTime = null;
            this.appServerTimeZone = null;
            this.processedServerDetails = {};
            this.currentBrowserDate = null;
            this.selectedTime = null;
            this.enteredDate = null;
            this.init();
        }

        today() {
            this.sendTime = new Date();
            this.recurrTime = new Date();
            this.recurrTime.setMinutes(Math.ceil(this.recurrTime.getMinutes() / 30) * 30);
            this.sendTime.setMinutes(Math.ceil(this.sendTime.getMinutes() / 30) * 30);
            this.currentBrowserDate = this.$filter('date')(new Date(), this.$filter("i18n_aip")("default.date.format"));
            this.currentBrowserDate = this.monthCapitalize(this.currentBrowserDate)
        };

        init() {

            this.spinnerService.showSpinner(true);
            this.recDisplayEndDateType="OFFSET";
            this.recurFreqeunecyList =
                [{
                    frequency: this.$filter("i18n_aip")("aip.admin.action.postactionItem.recurringPosting.recurr.constant.days"),
                    value: 'DAYS'
                },
                    {
                        frequency: this.$filter("i18n_aip")("aip.admin.action.postactionItem.recurringPosting.recurr.constant.hours"),
                        value: 'HOURS'
                    }]
            ;
            var allPromises = [];
            this.postActionItemInfo = {};
            this.editMode = this.$state.params.isEdit === "true" ? true : false;
            this.postIDvalue = this.$state.params.postIdval;

            allPromises.push(
                this.adminActionService.getGrouplist()
                    .then((response:AIP.IPostActionItemGroupResponse) => {
                        this.groupList = response.data;
                        this.postActionItemInfo.group = this.groupList;

                    })
            );

            allPromises.push(
                this.adminActionService.getPopulationlist()
                    .then((response:AIP.IPostActionItemPopulationResponse) => {
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

                    })
            );
            allPromises.push(

                this.adminActionService.getCurrentTimeZoneLocale()
                    .then((response:any) => {
                        var that = this;
                        this.timezones = response.data.timezones;
                        if (!this.editMode) {
                            this.getDefaultTimeZone();
                        }

                    })
            );


            this.$q.all(allPromises).then(() => {

                if (this.editMode) {
                    this.adminActionService.getJobDetails(this.$state.params.postIdval)
                        .then((response) => {
                            if (response) {

                                this.$scope.group = {};
                                this.$scope.population = {};
                                this.actionPost1 = response;
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

                                this.selected = this.$scope.group;
                                this.selectedPopulation = this.$scope.population;
                                this.postActionItemInfo.groupName = this.actionPost1.groupName;
                                this.postActionItemInfo.displayStartDate = this.actionPost1.postingDisplayStartDate;
                                this.postActionItemInfo.displayEndDate = this.actionPost1.postingDisplayEndDate;
                                this.postActionItemInfo.scheduledStartDate = this.actionPost1.postingDisplayDateTime;

                                if (this.actionPost1.postingCurrentState === 'Scheduled') {
                                    this.scheduleType = 'SCHEDULE';
                                } else {
                                    this.scheduleType = 'RECUR';
                                }
                                this.regeneratePopulation = this.actionPost1.populationRegenerateIndicator;
                                this.sendTime = this.actionPost1.postingDisplayTime;
                                var postingTimeZone = this.actionPost1.postingTimeZone.split(" ");
                                this.defaultTimeZone = this.$filter("i18n_aip")("timezone." + postingTimeZone[postingTimeZone.length - 1]);

                                for(var k=0;k<this.timezones.length;k++) {
                                    if(this.defaultTimeZone === this.timezones[k].displayNameWithoutOffset)
                                    {
                                        this.setTimezone(this.timezones[k]);
                                    }
                                }
                                this.appServerDate = this.actionPost1.postingScheduleDateTime;
                                this.appServerTime = this.actionPost1.scheduledStartTime;
                                this.appServerTimeZone = angular.element('<div></div>').html(this.actionPost1.timezoneStringOffset.displayNameWithoutOffset).text();

                                this.changedValue();

                                this.adminActionStatusService.getActionItemsById(this.$state.params.postIdval)
                                    .then((response) => {
                                        this.selectedActionListVal = response.data;
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
                else {
                    this.today();
                    this.getProcessedServerDateTimeAndTimezone()
                }
                this.spinnerService.showSpinner(false);
            });

            var that=this;
            this.$scope.$on("DetectChanges",function(event, args)
            {
                if (that.dirtyFlag) {
                    that.redirectval = args.state;
                    that.checkChangeDone();
                }

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

            this.changeFlag = true;
            this.itemLength = 0;
            this.modalResult = [];
            this.adminActionService.getGroupActionItem(this.selected.groupId)

                .then((response:AIP.IPostActionItemResponse) => {
                    this.actionItemList = response.data;
                    this.postActionItemInfo["groupAction"] = [];
                    this.postActionItemInfo.groupAction = this.actionItemList;
                })
        }

        showTimeZoneList() {
            this.showTimezoneIcon = false;
        };

        pad(number, length) {
            var str = "" + number;
            while (str.length < length) {
                str = '0' + str
            }
            return str
        }

        setTimezone(timezone)
        {
            this.timezone = timezone;
        };

        getDefaultTimeZone()
        {
            var that=this;
            var timeZoneOffset = new Date().getTimezoneOffset();
            var offset = "(GMT"+((timeZoneOffset<=0? '+':'-')+ this.pad(parseInt(Math.abs(timeZoneOffset/60)), 2)+ ":" + this.pad(Math.abs(timeZoneOffset%60), 2)) + ")";
            var finalValue = ''
            var timeZone = ''
            angular.forEach(this.timezones, function (key, value) {
                var GMTString = key.stringOffset;
                if (offset === GMTString) {
                    that.setTimezone(key);
                    finalValue = '( ' + key.displayNameWithoutOffset + ' )';
                    timeZone = key.displayName;
                }
            });
            this.defaultTimeZoneNameWithOffset = timeZone;
            this.defaultTimeZone = finalValue;
        }

        timeConversion()
        {
            if(this.scheduleType === "RECUR"){
                this.postActionItemInfo.scheduledStartDate = this.recurranceStartDate
            }

            this.enteredDate= (this.postActionItemInfo.scheduledStartDate === undefined) ? this.currentBrowserDate : this.postActionItemInfo.scheduledStartDate;


            if (this.sendTime instanceof Date){
                this.selectedTime =  this.$filter("date")(this.sendTime, "HHmm")
            }

            else if( !(this.sendTime instanceof Date) && (this.sendTime.indexOf(':')>-1)) {

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
                this.selectedTime = hour + min;
            }
            else{
                this.selectedTime=this.sendTime
            }
        }

        getProcessedServerDateTimeAndTimezone()
        {
            this.timeConversion()
            var userSelectedVal=
            {
                "userEnterDate": this.enteredDate  ,
                "userEnterTime": this.selectedTime,
                "userEnterTimeZone": this.timezone.timezoneId
            };

            this.adminActionStatusService.getProcessedServerDateTimeAndTimezone(userSelectedVal)
                .then((response) => {
                    this.processedServerDetails = response.data;
                    this.appServerDate = (this.postActionItemInfo.scheduledStartDate !== undefined) ? this.processedServerDetails.serverDate : null;
                    this.appServerTime = this.processedServerDetails.serverTime;
                    var serverTimeZone = this.processedServerDetails.serverTimeZone.split(" ")
                    this.appServerTimeZone = angular.element('<div></div>').html(serverTimeZone[serverTimeZone.length - 1]).text();

                });
        }

        getProcessedServerRecuranceEndDate()
        {

            var userSelectedVal=
            {
                "userEnterDate": this.recurranceEndDate,
                "userEnterTime": "2359",
                "userEnterTimeZone": this.timezone.timezoneId
            };

            this.adminActionStatusService.getProcessedServerDateTimeAndTimezone(userSelectedVal)
                .then((response) => {
                    this.processedServerDetails = response.data;
                    this.serverRecurEndDate = this.processedServerDetails.serverDate
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
                    selectedActionItemList: () => {
                        return this.selectedActionListVal
                    },
                    ChangeFlag: () => {
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
            if ((this.scheduleType === 'POSTNOW' || this.scheduleType === 'SCHEDULE') && !this.postActionItemInfo.displayStartDate || this.postActionItemInfo.displayStartDate === null || this.postActionItemInfo.displayStartDate === "") {
                this.errorMessage.startDate = "invalid StartDate";
            } else {
                delete this.errorMessage.startDate;
            }
            if ((this.scheduleType === 'POSTNOW' || this.scheduleType === 'SCHEDULE') && !this.postActionItemInfo.displayEndDate || this.postActionItemInfo.displayEndDate === null || this.postActionItemInfo.displayEndDate === "") {
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

            if (this.scheduleType === "RECUR" && this.recurCount || this.recurCount < 0) {
                this.errorMessage.success = "Recurance count cannot be zero ";
            }

            if (this.scheduleType === "RECUR" &&!this.recurCount) {
                this.errorMessage.success = "Recurance count cannot be zero ";
            }
            else {
                delete this.errorMessage.success;
            }

            if (this.scheduleType === "RECUR" &&  this.displayStartDateOffset ==null ) {
                this.errorMessage.success = "Display Start offset date cannot be empty";
            }

            if (this.scheduleType === "RECUR" &&  this.displayStartDateOffset < 0 ) {
                this.errorMessage.success = "Display Start offset date cannot be less than 0";
            }

            if (this.scheduleType === "RECUR" && this.recDisplayEndDateType==="OFFSET" &&  this.displayEndDateOffset ==null ) {
                this.errorMessage.success = "Display End date offset cannot be blank";
            }

            if (this.scheduleType === "RECUR" && this.recDisplayEndDateType==="OFFSET" &&  this.displayEndDateOffset<0 ) {
                this.errorMessage.success = "Invalid End date offset";
            }

            if (this.scheduleType === "RECUR" && this.recDisplayEndDateType==="EXACT"&&(!this.recurDisplayEndDate || this.recurDisplayEndDate === null || this.recurDisplayEndDate === "")) {
                this.errorMessage.success = "Invalid End dates";
            }
            if (this.scheduleType === "RECUR" && (!this.recurrTime || this.recurrTime === null || this.recurrTime === "")) {
                this.errorMessage.success = "Invalid  time";
            }

            if (this.scheduleType === "RECUR" && (!this.recurranceEndDate || this.recurranceEndDate === null || this.recurranceEndDate === "")) {
                this.errorMessage.success = "Invalid recurr end date";
            }

            if(this.scheduleType==="RECUR" && !this.selectedRecurFrequency){
                this.errorMessage.success = "Recurrance frequency cannot be more null";
            }

            if (Object.keys(this.errorMessage).length > 0) {
                return false;
            } else {
                return true;
            }
        }

        checkChanges() {
            this.dirtyFlag=true;
            this.$rootScope.DataChanged=this.dirtyFlag;

        }

        checkChangeDone(){
            var that=this;
            if (that.dirtyFlag === true) {
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.actionItem.saveChanges"),
                    type: "warning"
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.no"), function () {
                      notifications.remove(n);
                });
                n.addPromptAction(this.$filter("i18n_aip")("aip.common.text.yes"), function () {
                    notifications.remove(n);
                    that.dirtyFlag=false;
                    that.$rootScope.DataChanged=false;
                    if(that.redirectval==="NoData"){
                        that.$state.go("admin-post-list");
                    }else{
                        location.href = that.redirectval;
                    }
                });
                notifications.addNotification(n);
            }
            else
            {
                that.$state.go("admin-post-list");
            }
        }


        cancel() {

            this.redirectval="NoData";
            this.checkChangeDone();
        }

        monthCapitalize(date) {
            var date=date.replace('.','');
            return date.replace(/\b\w/g , function(month){ return month.toUpperCase();} );
        }

        save() {
            var userSelectedTime;
            this.postNow = this.scheduleType === 'POSTNOW'?true:false
            if(this.postNow===true){
                this.saving = true;
                var userSelectedTime=null;
                var CurrentDateTimeDetails = new Date();
                var currentTime = this.$filter('date')(CurrentDateTimeDetails, 'HHmm');
                this.sendTime=null;
                this.timezone=null;
                this.today();
                this.getDefaultTimeZone();
                this.displayDatetimeZone.dateVal=this.currentBrowserDate;
                this.displayDatetimeZone.timeVal=currentTime.toString();
                this.displayDatetimeZone.timeZoneVal=this.timezone.stringOffset+' '+this.timezone.timezoneId;
            } else if(this.scheduleType === 'SCHEDULE'){
                if (this.editMode && !(this.sendTime instanceof Date)) {
                    if(this.selectedTime) {
                        userSelectedTime = this.selectedTime;
                    }
                    else{
                        this.timeConversion()
                        userSelectedTime = this.selectedTime;
                    }
                    this.displayDatetimeZone.dateVal=this.postActionItemInfo.scheduledStartDate;
                    this.displayDatetimeZone.timeVal=this.selectedTime;
                    this.displayDatetimeZone.timeZoneVal=this.timezone.stringOffset+' '+this.timezone.timezoneId;

                } else {
                    if(this.sendTime instanceof Date) {
                        userSelectedTime = this.$filter("date")(this.sendTime, "HHmm");
                    }
                    else{
                        userSelectedTime= this.sendTime;
                    }
                    this.displayDatetimeZone.dateVal=this.postActionItemInfo.scheduledStartDate;
                    this.displayDatetimeZone.timeVal=this.selectedTime;
                    this.displayDatetimeZone.timeZoneVal=this.timezone.stringOffset+' '+this.timezone.timezoneId;
                }
            }else{
                if(this.recurrTime instanceof Date) {
                    userSelectedTime = this.$filter("date")(this.recurrTime, "HHmm");
                }
                else{
                    userSelectedTime= this.recurrTime;
                }
                this.displayDatetimeZone.dateVal=this.postActionItemInfo.scheduledStartDate;
                this.displayDatetimeZone.timeVal=this.selectedTime;
                this.displayDatetimeZone.timeZoneVal=this.timezone.stringOffset+' '+this.timezone.timezoneId;

            }
            if(this.scheduleType==='RECUR'){
                this.adminActionService.saveRecurringActionItem(this.postActionItemInfo, this.selected,this.modalResults,this.selectedPopulation,this.regeneratePopulation,this.recurCount,this.selectedRecurFrequency, this.displayStartDateOffset,this.recDisplayEndDateType,this.displayEndDateOffset,this.recurDisplayEndDate,this.recurranceStartDate,this.recurranceEndDate,userSelectedTime,this.timezone.timezoneId,this.displayDatetimeZone)
                    .then((response:AIP.IPostActionItemSaveResponse) => {
                        this.saving = false;
                        var notiParams = {};
                        if (response.data.success) {
                            notiParams = {
                                notiType: "saveSuccess",
                                data: response.data
                            };
                            this.dirtyFlag = false;
                            this.$rootScope.DataChanged=false;
                            this.$state.go("admin-post-list", {noti: notiParams, data: response.data.savedJob.id});
                        } else {
                            this.saveErrorCallback(response.data.message);
                        }
                    }, (err) => {
                        this.saving = false;
                        //TODO:: handle error call
                        console.log(err);
                    });
            }else{
            this.adminActionService.savePostActionItem(this.postActionItemInfo, this.selected, this.modalResults, this.selectedPopulation, this.postNow, userSelectedTime, this.timezone.timezoneId, this.regeneratePopulation, this.displayDatetimeZone)
                .then((response:AIP.IPostActionItemSaveResponse) => {
                    this.saving = false;
                    var notiParams = {};
                    if (response.data.success) {
                        notiParams = {
                            notiType: "saveSuccess",
                            data: response.data
                        };
                        this.dirtyFlag = false;
                        this.$rootScope.DataChanged=false;
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

