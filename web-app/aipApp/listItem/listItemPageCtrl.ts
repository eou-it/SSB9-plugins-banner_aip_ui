/*********************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/userService.ts"/>

declare var register;
declare var notifications;
declare var Notification;
declare var Notifications;

module AIP {


    interface IListItemPageCtrl {
        itemListViewService: AIP.ItemListViewService;
        userService: AIP.UserService;
        actionItems: IUserItem;
        selectedData: ISelectedData;
        initialOpenGroup: number;

        getInitialSelection(): number;

        openConfirm(groupId: string | number, row): void;

        getParams(title: string, userInfo: AIP.IUserInfo): string[];

        styleFunction(key: string): string;

        showGroupInfo(idx: number);

        getHeight(): { height: number };

        nextItem(groupId: string | number, itemId: number): void;

        selectItem(groupId: number | string, itemId: number | string): void;

        toggleDetail(state: { idx: number | string, open: boolean }): void;

        resetSelection(): void;

        saveErrorCallback(message: string): void;
    }

    export class ListItemPageCtrl implements IListItemPageCtrl {

        $inject = ["$scope", "$state", "ItemListViewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$compile"];
        itemListViewService: AIP.ItemListViewService;
        userService: AIP.UserService;
        actionItems: IUserItem;
        $uibModal;
        initialOpenGroup;
        spinnerService;
        userName;
        $sce;
        selectedData: ISelectedData;
        $timeout;
        $state;
        $q;
        APP_ROOT;
        modalInstance;
        isFromGateKeeper;
        $compile;
        showModal;

        constructor($scope, $state, ItemListViewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $compile) {
            $scope.vm = this;
            this.$state = $state;
            this.itemListViewService = ItemListViewService;
            this.userService = AIPUserService;
            this.spinnerService = SpinnerService;
            this.$timeout = $timeout;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.APP_ROOT = APP_ROOT;
            this.$sce = $sce;
            this.modalInstance;
            this.isFromGateKeeper = false;
            this.initialOpenGroup = -1;
            this.$compile = $compile;
            $scope.showModal = false;
            $scope.$watch(
                "vm.detailView", function (newVal, oldVal) {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            );
            //Listen to your custom event
            window.addEventListener('responseChanged', function (e) {
                $scope.responseId = window.params.responseId;
                $scope.actionItemId = window.params.actionItemId;
                $scope.maxAttachments = window.params.maxAttachments;
                var listItemPageDiv = $('.listActionItem');
                var attachmentModal = $('aip-attachment');
                if (attachmentModal.length > 0) {
                    attachmentModal.remove();
                }
                var aipAttachmentDirective = $compile("<aip-attachment show-modal='showModal' response-id ='responseId' action-item-id='actionItemId' max-attachments ='maxAttachments'></aip-attachment>")($scope);
                listItemPageDiv.append(aipAttachmentDirective);
                $scope.showModal = true;
                $scope.$apply();
            });

            notifications.on('add', function (e) {
                setTimeout(function (e) {
                    if (params.saved == true) {
                        //$scope.vm.init();
                        $scope.vm.refreshList();
                    }
                }, 500);
            });

            this.init();

            $scope.previousLink = function () {
                if (window.reUrl && window.reUrl != '') {
                    window.location.replace(decodeURI(window.reUrl));
                } else {
                    window.history.back();
                }
            };

        }

        init() {

            var href = window.location.href;
            if (href.indexOf("/informedList") > 0) {
                this.isFromGateKeeper = true;
            }
            this.informModal(this.isFromGateKeeper);
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then((userData) => {
                var userInfo = userData;
                this.userName = userData.fullName;
                this.itemListViewService.getActionItems(userInfo).then((actionItems: IUserItem) => {
                    this.actionItems = actionItems;
                    angular.forEach(this.actionItems.groups, (item) => {
                        item.dscParams = this.getParams(item.title, userInfo);
                    });
                }).finally(() => {
                    this.spinnerService.showSpinner(false);

                    this.initialOpenGroup = this.getInitialSelection();

                    if (this.initialOpenGroup !== -1) {
                        this.itemListViewService.getDetailInformation(this.actionItems.groups[this.initialOpenGroup].id, "group", null)
                            .then((response: ISelectedData) => {
                                this.selectedData = response;
                                this.selectedData.info.content = this.trustHTML(response.info.content);
                            });
                    }
                    ;
                });
            });

        }

        refreshList() {
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then((userData) => {
                var userInfo = userData;
                this.userName = userData.fullName;

                this.itemListViewService.getActionItems(userInfo).then((actionItems: IUserItem) => {
                    this.actionItems = actionItems;
                    angular.forEach(this.actionItems.groups, (item) => {
                        item.dscParams = this.getParams(item.title, userInfo);
                    });

                    // this.resetSelection();
                }).finally(() => {
                    this.spinnerService.showSpinner(false);
                    setTimeout(function () {
                        $("#item-" + params.groupId + "-" + params.actionItemId).focus()
                            , 100
                    })
                })
            })
        }

        trustHTML = function (txtString) {
            var sanitized = txtString ? this.$sce.trustAsHtml(txtString) : "";
            return sanitized;
        }

        getInitialSelection() {
            var defaultSelection = 0;
            if (this.actionItems.groups.length === 0) {
                defaultSelection = -1;
            }
            return defaultSelection;
            //TODO:: when multiple group available, first available group could be opened
        }

        openConfirm(groupId, row) {

            //TODO:: get selected row action item detail information
            //TODO:: display action item detail information
        }

        styleFunction(key) {
            var returnClass = "";
            switch (key) {
                case "title":
                    returnClass = "col-xs-8 col-sm-8";
                    break;
                case "state":
                    returnClass = "col-xs-4 col-sm-4";
                    break;
                case "description":
                    returnClass = "col-xs-12 clearfix col-sm-12 ";
                    break;
            }
            return returnClass + " cell " + key;
        }

        getParams(title, userInfo) {
            //TODO:: parameter for description
            var param = [];
            switch (title) {
                case "aip.user.list.header.title.registration":
                    param.push(userInfo.fullName || userInfo.firstName);
                    break;
                case "aip.user.list.header.title.graduation":
                    param.push(userInfo.graduateCredit || "121");
                    break;
                default:
                    break;
            }
            return param;
        }

        showGroupInfo(groupId) {
            this.selectItem(groupId, null);
        }

        getHeight() {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".listActionItem .welcome").height() -
                30;
            return {height: containerHeight};
        }

        nextItem(groupId, itemId) {
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }

            if (index.item > -1) {
                if ((this.actionItems.groups[index.group].items.length) - 1 > index.item) {
                    index.item++;
                } else {
                    index.item = 0;
                }
                var nextItemId = this.actionItems.groups[index.group].items[index.item].id;
                this.selectItem(groupId, nextItemId);
            } else {
                var firstItemId = this.actionItems.groups[index.group].items[0].id;
                this.selectItem(groupId, firstItemId);
            }
        }

        selectItem(groupId, itemId) {
            var defer = this.$q.defer();
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            var selectionType = itemId === null ? "group" : "actionItem";
            var group = this.actionItems.groups.filter((item) => {
                return item.id == groupId;
            });

            var actionItem = group[0].items.filter((item) => {
                return item.id == itemId;
            });

            this.itemListViewService.getDetailInformation(groupId, selectionType, itemId).then((response: ISelectedData) => {
                this.selectedData = response;
                this.selectedData.info.content = this.trustHTML(response.info.content);
                if (selectionType === "actionItem") {
                    var group = this.actionItems.groups.filter((item) => {
                        return item.id === groupId;
                    });
                    var acitonItem = group[0].items.filter((item) => {
                        return item.actionItemId === itemId;
                    });
                    this.selectedData.info.title = actionItem[0].title;
                }
                defer.resolve();
            })
            return defer.promise;
        }

        getIndex(groupId, itemId) {
            var index = {group: -1, item: null};
            var selectedGroup = this.actionItems.groups.filter((group) => {
                return group.id == groupId;
            });


            if (selectedGroup.length !== -1) {
                index.group = this.actionItems.groups.indexOf(selectedGroup[0]);

                var groupItems = this.actionItems.groups[index.group].items;

                var selectedItem = groupItems.filter((item) => {
                    return item.id == itemId;
                });

                if (groupItems.length !== -1) {
                    index.item = groupItems.indexOf(selectedItem[0]);
                }

            }
            return index;
        }

        toggleDetail(state) {
            if (state.open) {
                this.itemListViewService.getDetailInformation(state.groupId, "group", null)
                    .then((response: ISelectedData) => {
                        this.selectedData = response;
                        this.selectedData.info.content = this.trustHTML(response.info.content);
                    })

            } else {
                this.selectedData = undefined;
            }
        }

        resetSelection() {
            this.selectedData = undefined;
        }

        documentUploader(responseElementId, paperClipId, responseElement, allowedAttachments, responseId) {
            var isElementPresent = document.getElementById(paperClipId);
            if (isElementPresent === null && responseElement.length > 0) {
                var paperClipElement = angular.element("<input id=" + paperClipId + " type='image' " +
                    "src='../images/attach_icon_disabled.svg' title = 'Click to add documents' " +
                    "class=' pb-detail pb-item pb-paperclip'/>");
                window.params.maxAttachments = allowedAttachments;
                responseElement.after(paperClipElement);
                $('#' + paperClipId).on("click", function () {
                    var selectedPaperClip = this.id
                    var currentId = selectedPaperClip.substring(selectedPaperClip.length - 1, selectedPaperClip.length);
                    currentId = "#pbid-ActionItemStatusAgree-radio-0-" + currentId;
                    if ($(currentId)[0].checked === true) {
                        //make sure paper clip is enabled
                        window.params.responseId = $(currentId)[0].value;
                        $("#" + selectedPaperClip)[0].setAttribute("src", "../images/attach_icon_default.svg");
                        var evt = new CustomEvent('responseChanged');
                        window.dispatchEvent(evt);
                    }
                });
            }
        }

        informModal(show) {
            if (show) {
                this.modalInstance = this.$uibModal.open({
                    templateUrl: this.APP_ROOT + "listItem/itemInform/itemInformTemplate.html",
                    controller: "ItemInformCtrl",
                    controllerAs: "$ctrl",
                    size: "lg",
                    windowClass: "aip-modal"
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

register("bannerNonAdminAIP").controller("ListItemPageCtrl", AIP.ListItemPageCtrl);
