///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminActionService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>

declare var register;
declare var Notification: any;
declare var notifications: any;

module AIP {

    export class AdminActionItemOpenPageCtrl{
        $inject = ["$scope", "$q", "$state", "$filter", "$sce", "$window", "$templateRequest", "$templateCache", "$compile",
            "SpinnerService", "AdminActionService"];
        adminActionService: AIP.AdminActionService;
        spinnerService: AIP.SpinnerService;
        $q: ng.IQService;
        $state;
        $filter;
        $sce;
        $window;
        $templateRequest;
        $templateCache;
        $compile;
        actionItem;
        scope;
        isAssigned;
        constructor($scope, $q:ng.IQService, $state, $filter, $sce, $window, $templateRequest, $templateCache, $compile,
                    SpinnerService, AdminActionService) {
            $scope.vm = this;
            this.scope = $scope;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.$window = $window;
            this.$templateRequest = $templateRequest;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.adminActionService = AdminActionService;
            this.spinnerService = SpinnerService;
            this.actionItem = {};
            this.isAssigned = false;
            this.init();
            angular.element($window).bind('resize', function() {
                //$scope.onResize();
                $scope.$apply();
            });
        }

        init() {
            this.spinnerService.showSpinner( true );
            var promises = [];
            this.adminActionService.getActionItemDetail( this.$state.params.data)
                .then((response:AIP.IActionItemOpenResponse) => {
                    this.actionItem = response.data.actionItem;
                    $("#title-panel h1" ).html(this.actionItem.actionItemName);
                    $("p.openActionItemTitle" ).html(this.actionItem.actionItemName);
                    $("p.openActionItemFolder" ).html(this.actionItem.folderName);
                    $("p.openActionItemStatus" ).html(this.actionItem.actionItemStatus);
                    $("p.openActionItemDesc" ).html(this.actionItem.actionItemDesc);
                    $("p.openActionItemActivityDate" ).html( this.actionItem.actionItemActivityDate);
                    $("p.openActionItemLastUpdatedBy" ).html(this.actionItem.actionItemUserId);
                    // $(".actionItemOpenContainer").height(this.getHeight());
                }, ( err ) => {
                    console.log( err );
                } );
            if (this.$state.params.noti) {
                this.handleNotification( this.$state.params.noti );
            }
            this.$q.all( promises ).then( () => {
                //TODO:: turn off the spinner
                this.spinnerService.showSpinner( false );
                var actionItemFolder:any = $("#actionItemTemplate");
                if(actionItemFolder) {
                    actionItemFolder.select2({
                        width: "25em",
                        minimumResultsForSearch: Infinity,
                        placeholderOption: "first"
                    });
                }
            } );
        }

        handleNotification(noti) {
            if(noti.notiType === "saveSuccess") {
                var data = noti.data.newActionItem;
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.action.add.success"), //+
                    type: "success",
                    flash: true
                });
                setTimeout(() => {
                    notifications.addNotification(n);
                    this.$state.params.noti = undefined;
                    $(".actionItemAddContainer").focus();
                }, 500);
            }
        }

        getHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() - 30;
            return {height: containerHeight};
        }
        getSaparatorHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $(".xe-tab-container").height() -
                $("#outerFooter").height() - 30;
            return {height: containerHeight};
        }
        // openDetailPanel() {
        //     var deferred=this.$q.defer();
        //     // var templateUrl = this.$sce.getTrustedResourceUrl("/action/open/overview");
        //     var template = this.$templateCache.get("adminActionItemOpenOverview.html");
        //     deferred.resolve(template);
        //     // this.$templateRequest(templateUrl)
        //     //     .then((template) => {
        //     //         var compiled = this.$compile(template)(this.scope);
        //     //         deferred.resolve(compiled);
        //     //     }, (error) => {
        //     //         console.log(error);
        //     //     });
        //     return deferred.promise;
        // }
    }

}

register("bannerAIP").controller("AdminActionItemOpenPageCtrl", AIP.AdminActionItemOpenPageCtrl);
