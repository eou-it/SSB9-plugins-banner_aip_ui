/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/

///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="../../common/services/aipReviewService.ts"/>
    ///<reference path="../../common/services/userService.ts"/>
declare var register;

module AIP {


    interface IReviewActionItemCtrl {
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
    }

    export class ReviewActionItemCtrl implements IReviewActionItemCtrl {

        $inject = ["$scope", "$state", "AIPReviewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce"];
        aipReviewService: AIP.AIPReviewService;
        userService: AIP.UserService;
        actionItems: IActionItem[];
        $uibModal;
        spinnerService;
        $sce;
        $timeout;
        $state;
        $q;
        APP_ROOT;
        actionItemNamesList;
        personId;
        personName;
        selected;
        option;

        constructor($scope, $state, AIPReviewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce) {
            $scope.vm = this;
            this.$state = $state;
            this.aipReviewService = AIPReviewService;
            this.userService = AIPUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.APP_ROOT = APP_ROOT;
            this.$sce = $sce;
            this.actionItemNamesList=[];
            this.personId;
            this.personName;
            this.selected;
            this.option;
        }


    }
}

register("bannerAIPReview").controller("reviewActionItemCtrl", AIP.ReviewActionItemCtrl);
