/*********************************************************************************
 Copyright 2018-2019 Ellucian Company L.P. and its affiliates.
 **********************************************************************************/
///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../common/services/itemListViewService.ts"/>
///<reference path="../common/services/userService.ts"/>
var AIP;
(function (AIP) {
    var ListItemPageCtrl = /** @class */ (function () {
        function ListItemPageCtrl($scope, $state, ItemListViewService, AIPUserService, SpinnerService, $timeout, $q, $uibModal, APP_ROOT, $sce, $compile, $filter) {
            var _this = this;
            this.$inject = ["$scope", "$state", "ItemListViewService", "AIPUserService", "SpinnerService", "$timeout", "$q", "$uibModal", "APP_ROOT", "$sce", "$compile", "$filter"];
            this.trustHTML = function (txtString) {
                var sanitized = txtString ? this.$sce.trustAsHtml(txtString) : "";
                return sanitized;
            };
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
            this.$filter = $filter;
            $scope.showModal = false;
            $scope.$watch("vm.detailView", function (newVal, oldVal) {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
            window.onbeforeunload = function (event) {
                if (params.isResponseModified) {
                    return _this.$filter("i18n_aip")("aip.common.admin.unsaved");
                }
                // reset to default event listener
                window.onbeforeunload = null;
            };
            //Listen to custom event
            window.addEventListener('responseChanged', function (e) {
                $scope.responseId = window.params.responseId;
                $scope.userActionItemId = window.params.userActionItemId;
                $scope.maxAttachments = window.params.maxAttachments;
                $scope.isResponseLocked = window.params.isResponseLocked;
                var listItemPageDiv = $('.listActionItem');
                var attachmentModal = $('aip-attachment');
                if (attachmentModal.length > 0) {
                    attachmentModal.remove();
                }
                var aipAttachmentDirective = $compile("<aip-attachment show-modal='showModal' response-id ='responseId' user-action-item-id='userActionItemId' max-attachments ='maxAttachments' response-locked = 'isResponseLocked'></aip-attachment>")($scope);
                listItemPageDiv.append(aipAttachmentDirective);
                $scope.showModal = true;
                $scope.$apply();
            });
            notifications.on('add', function (e) {
                setTimeout(function (e) {
                    if (params.saved == true) {
                        params.isResponseModified = false;
                        //$scope.vm.init();
                        $scope.vm.refreshList();
                    }
                }, 500);
            });
            this.init();
        }
        ListItemPageCtrl.prototype.init = function () {
            var _this = this;
            var href = window.location.href;
            if (href.indexOf("/informedList") > 0) {
                this.isFromGateKeeper = true;
            }
            this.informModal(this.isFromGateKeeper);
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then(function (userData) {
                var userInfo = userData;
                _this.userName = userData.fullName;
                _this.itemListViewService.getActionItems(userInfo).then(function (actionItems) {
                    _this.actionItems = actionItems;
                    angular.forEach(_this.actionItems.groups, function (item) {
                        item.dscParams = _this.getParams(item.title, userInfo);
                    });
                }).finally(function () {
                    _this.spinnerService.showSpinner(false);
                    _this.initialOpenGroup = _this.getInitialSelection();
                    if (_this.initialOpenGroup !== -1) {
                        _this.itemListViewService.getDetailInformation(_this.actionItems.groups[_this.initialOpenGroup].id, "group", null)
                            .then(function (response) {
                            _this.selectedData = response;
                            _this.selectedData.info.content = _this.trustHTML(response.info.content);
                        });
                    }
                });
            });
        };
        ListItemPageCtrl.prototype.previousLink = function () {
            if (params.isResponseModified) {
                this.itemListViewService.saveChangesNotification(this.goBack, this, null, null);
            }
            else {
                this.goBack();
            }
        };
        ;
        ListItemPageCtrl.prototype.goBack = function () {
            if (window.reUrl && window.reUrl != '') {
                window.location.replace(decodeURI(window.reUrl));
            }
            else {
                window.history.back();
            }
        };
        ListItemPageCtrl.prototype.refreshList = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            this.userService.getUserInfo().then(function (userData) {
                var userInfo = userData;
                _this.userName = userData.fullName;
                _this.itemListViewService.getActionItems(userInfo).then(function (actionItems) {
                    _this.actionItems = actionItems;
                    angular.forEach(_this.actionItems.groups, function (item) {
                        item.dscParams = _this.getParams(item.title, userInfo);
                    });
                    // this.resetSelection();
                }).finally(function () {
                    _this.spinnerService.showSpinner(false);
                    setTimeout(function () {
                        $("#item-" + params.groupId + "-" + params.actionItemId).focus()
                            , 100;
                    });
                });
            });
        };
        ListItemPageCtrl.prototype.getInitialSelection = function () {
            var defaultSelection = 0;
            if (this.actionItems.groups.length === 0) {
                defaultSelection = -1;
            }
            return defaultSelection;
            //TODO:: when multiple group available, first available group could be opened
        };
        ListItemPageCtrl.prototype.openConfirm = function (groupId, row) {
            //TODO:: get selected row action item detail information
            //TODO:: display action item detail information
        };
        ListItemPageCtrl.prototype.styleFunction = function (key) {
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
        };
        ListItemPageCtrl.prototype.getParams = function (title, userInfo) {
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
        };
        ListItemPageCtrl.prototype.showGroupInfo = function (groupId) {
            this.selectItem(groupId, null);
        };
        ListItemPageCtrl.prototype.getHeight = function () {
            var containerHeight = $(document).height() -
                $("#breadcrumb-panel").height() -
                $("#title-panel").height() -
                $("#header-main-section").height() -
                $("#outerFooter").height() -
                $(".listActionItem .welcome").height() -
                30;
            return { height: containerHeight };
        };
        ListItemPageCtrl.prototype.nextItem = function (groupId, itemId) {
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            if (index.item > -1) {
                if ((this.actionItems.groups[index.group].items.length) - 1 > index.item) {
                    index.item++;
                }
                else {
                    index.item = 0;
                }
                var nextItemId = this.actionItems.groups[index.group].items[index.item].id;
                this.selectItem(groupId, nextItemId);
            }
            else {
                var firstItemId = this.actionItems.groups[index.group].items[0].id;
                this.selectItem(groupId, firstItemId);
            }
        };
        ListItemPageCtrl.prototype.selectItem = function (groupId, itemId) {
            if (params.isResponseModified) {
                this.itemListViewService.saveChangesNotification(this.displayActionItem, this, groupId, itemId);
            }
            else {
                this.displayActionItem(groupId, itemId);
            }
        };
        ListItemPageCtrl.prototype.displayActionItem = function (groupId, itemId) {
            var _this = this;
            var index = this.getIndex(groupId, itemId);
            if (index.group === -1) {
                throw new Error("Group does not exist with ID ");
            }
            var selectionType = itemId === null ? "group" : "actionItem";
            var group = this.actionItems.groups.filter(function (item) {
                return item.id == groupId;
            });
            var actionItem = group[0].items.filter(function (item) {
                return item.id == itemId;
            });
            this.itemListViewService.getDetailInformation(groupId, selectionType, itemId).then(function (response) {
                _this.selectedData = response;
                _this.selectedData.info.content = _this.trustHTML(response.info.content);
                if (selectionType === "actionItem") {
                    var group = _this.actionItems.groups.filter(function (item) {
                        return item.id === groupId;
                    });
                    var actionItem = group[0].items.filter(function (item) {
                        return item.id === itemId;
                    });
                    _this.selectedData.info.title = actionItem[0].title;
                }
                setTimeout(function () {
                    $(".detail").focus();
                }, 10);
            });
        };
        ListItemPageCtrl.prototype.getIndex = function (groupId, itemId) {
            var index = { group: -1, item: null };
            var selectedGroup = this.actionItems.groups.filter(function (group) {
                return group.id == groupId;
            });
            if (selectedGroup.length !== -1) {
                index.group = this.actionItems.groups.indexOf(selectedGroup[0]);
                var groupItems = this.actionItems.groups[index.group].items;
                var selectedItem = groupItems.filter(function (item) {
                    return item.id == itemId;
                });
                if (groupItems.length !== -1) {
                    index.item = groupItems.indexOf(selectedItem[0]);
                }
            }
            return index;
        };
        ListItemPageCtrl.prototype.toggleDetail = function (state) {
            var _this = this;
            if (state.open) {
                this.itemListViewService.getDetailInformation(state.groupId, "group", null)
                    .then(function (response) {
                    _this.selectedData = response;
                    _this.selectedData.info.content = _this.trustHTML(response.info.content);
                });
            }
            else {
                this.selectedData = undefined;
            }
        };
        ListItemPageCtrl.prototype.resetSelection = function () {
            this.selectedData = undefined;
        };
        ListItemPageCtrl.prototype.documentUploader = function (userActionItemId, paperClipId, responseElement, allowedAttachments, responseId, isResponseLocked) {
            var isElementPresent = document.getElementById(paperClipId);
            if (isElementPresent === null && responseElement.length > 0) {
                var paperClipElement = angular.element("<input id=" + paperClipId + " type='image' " +
                    "src='../images/attach_icon_disabled.svg' title = 'Click to add documents' " +
                    "class=' pb-detail pb-item pb-paperclip'/>");
                this.setMaxAttachmentParam(allowedAttachments, paperClipId, responseId);
                responseElement.after(paperClipElement);
                window.params.userActionItemId = userActionItemId;
                window.params.isResponseLocked = isResponseLocked;
                $('#' + paperClipId).on("click", function () {
                    var selectedPaperClip = this.id;
                    var currentId = selectedPaperClip.substring(selectedPaperClip.length - 1, selectedPaperClip.length);
                    currentId = "#pbid-ActionItemStatusAgree-radio-0-" + currentId;
                    if ($(currentId)[0].checked === true) {
                        //make sure paper clip is enabled
                        window.params.responseId = $(currentId)[0].value;
                        window.params.maxAttachments = $("#maxAttachment" + paperClipId + $(currentId)[0].value).val();
                        $("#" + selectedPaperClip)[0].setAttribute("src", "../assets/attach_icon_default.svg");
                        // Create the event.
                        var event = document.createEvent('Event');
                        // Define that the event name is 'responseChanged'.
                        event.initEvent('responseChanged', true, true);
                        window.dispatchEvent(event);
                    }
                });
            }
        };
        ListItemPageCtrl.prototype.setMaxAttachmentParam = function (allowedAttachments, paperClipId, responseId) {
            var maxAttachmentHiddenElement = $("#maxAttachment" + paperClipId + responseId);
            if (maxAttachmentHiddenElement.length === 0) {
                $('<input>', {
                    type: 'hidden',
                    id: 'maxAttachment' + paperClipId + responseId,
                    name: 'maxAttachment' + paperClipId + responseId,
                    value: allowedAttachments
                }).appendTo('body');
            }
            else {
                maxAttachmentHiddenElement.val(allowedAttachments);
            }
        };
        ListItemPageCtrl.prototype.informModal = function (show) {
            if (show) {
                this.modalInstance = this.$uibModal.open({
                    templateUrl: this.APP_ROOT + "listItem/itemInform/itemInformTemplate.html",
                    controller: "ItemInformCtrl",
                    controllerAs: "$ctrl",
                    size: "lg",
                    windowClass: "aip-modal"
                });
            }
        };
        ListItemPageCtrl.prototype.saveErrorCallback = function (message) {
            var n = new Notification({
                message: message,
                type: "error",
                flash: true
            });
            notifications.addNotification(n);
        };
        return ListItemPageCtrl;
    }());
    AIP.ListItemPageCtrl = ListItemPageCtrl;
})(AIP || (AIP = {}));
register("bannerNonAdminAIP").controller("ListItemPageCtrl", AIP.ListItemPageCtrl);
