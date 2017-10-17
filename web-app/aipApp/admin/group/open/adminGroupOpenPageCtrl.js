///<reference path="../../../../typings/tsd.d.ts"/>
///<reference path="../../../common/services/admin/adminGroupService.ts"/>
///<reference path="../../../common/services/spinnerService.ts"/>
var AIP;
(function (AIP) {
    var AdminGroupOpenPageCtrl = (function () {
        function AdminGroupOpenPageCtrl($scope, AdminGroupService, $q, SpinnerService, $state, $filter, $sce, $templateRequest, $templateCache, $compile, $timeout, APP_ROOT) {
            this.$inject = ["$scope", "AdminGroupService", "$q", "SpinnerService", "$state", "$filter", "$sce", "$templateRequest", "$templateCache",
                "$compile", "$timeout", "APP_ROOT"];
            $scope.vm = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$state = $state;
            this.$filter = $filter;
            this.$sce = $sce;
            this.adminGroupService = AdminGroupService;
            this.spinnerService = SpinnerService;
            this.$templateRequest = $templateRequest;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.APP_ROOT = APP_ROOT;
            this.assignedActionItems = [];
            this.editMode = false;
            this.selected = {};
            this.allActionItems = [];
            this.init();
        }
        AdminGroupOpenPageCtrl.prototype.init = function () {
            var _this = this;
            this.spinnerService.showSpinner(true);
            var promises = [];
            // this.openOverviewPanel();
            this.groupFolder = this.$state.params.data;
            //var groupDescHtml = this.$sce.trustAsHtml(this.$state.params.data.description);
            //console.log(groupDescHtml);
            //todo: replace this temporary workaround for sce not working for description
            $("p.openGroupDesc").html(this.$state.params.data.groupDesc);
            $("#title-panel h1").html(this.$state.params.data.groupName);
            if (this.$state.params.noti) {
                this.handleNotification(this.$state.params.noti);
            }
            this.$q.all(promises).then(function () {
                //TODO:: turn off the spinner
                _this.spinnerService.showSpinner(false);
            });
        };
        AdminGroupOpenPageCtrl.prototype.openPanel = function (panelName) {
            var _this = this;
            var deferred = this.$q.defer();
            var url = "";
            switch (panelName) {
                case "overview":
                    url = this.APP_ROOT + "admin/group/open/overview/overview.html";
                    break;
                case "content":
                    url = this.APP_ROOT + "admin/group/open/content/content.html";
                    break;
                case "edit":
                    url = this.APP_ROOT + "admin/group/open/edit/edit.html";
                default:
                    break;
            }
            var newScope = this.$scope.$new(true); // isolate scope
            newScope.vm = this.$scope.vm;
            var templateUrl = this.$sce.getTrustedResourceUrl(url);
            this.$templateRequest(templateUrl)
                .then(function (template) {
                var compiled = _this.$compile(template)(newScope);
                deferred.resolve(compiled);
                if (panelName === "overview") {
                    $("#title-panel").children()[0].innerHTML = _this.groupFolder.groupTitle;
                }
            }, function (error) {
                console.log(error);
            });
            return deferred.promise;
        };
        AdminGroupOpenPageCtrl.prototype.openOverviewPanel = function () {
            var _this = this;
            this.editMode = false;
            var deferred = this.$q.defer();
            this.adminGroupService.getGroupDetail(this.$state.params.data)
                .then(function (response) {
                if (response.group) {
                    _this.groupFolder = response.group;
                }
                else {
                    //todo: output error in notification center?
                    console.log("fail");
                }
                deferred.resolve(_this.openPanel("overview"));
            }, function (err) {
                //TODO:: handle error call
                console.log(err);
            });
            return deferred.promise;
        };
        AdminGroupOpenPageCtrl.prototype.openContentPanel = function () {
            var _this = this;
            var deferred = this.$q.defer();
            var promises = [];
            this.spinnerService.showSpinner(true);
            promises.push(this.adminGroupService.getAssignedActionItemInGroup(this.$state.params.data)
                .then(function (response) {
                _this.assignedActionItems = response;
            }, function (err) {
                _this.assignedActionItems = [];
                console.log(err);
            }));
            promises.push(this.adminGroupService.getActionItemListForselect()
                .then(function (response) {
                _this.allActionItems = response;
            }, function (err) {
                console.log(err);
            }));
            this.$q.all(promises).then(function () {
                _this.spinnerService.showSpinner(false);
                deferred.resolve(_this.openPanel("content"));
            });
            return deferred.promise;
        };
        AdminGroupOpenPageCtrl.prototype.edit = function () {
            console.log("edit");
            this.editMode = true;
        };
        AdminGroupOpenPageCtrl.prototype.handleNotification = function (noti) {
            var _this = this;
            if (noti.notiType === "saveSuccess") {
                var data = noti.data.group[0];
                var n = new Notification({
                    message: this.$filter("i18n_aip")("aip.admin.group.add.success"),
                    type: "success",
                    flash: true
                });
                setTimeout(function () {
                    notifications.addNotification(n);
                    _this.$state.params.noti = undefined;
                    $(".groupAddContainer").focus();
                }, 500);
            }
        };
        AdminGroupOpenPageCtrl.prototype.groupFn = function () {
            return true;
        };
        AdminGroupOpenPageCtrl.prototype.cancel = function () {
        };
        AdminGroupOpenPageCtrl.prototype.save = function () {
        };
        AdminGroupOpenPageCtrl.prototype.addNew = function () {
        };
        AdminGroupOpenPageCtrl.prototype.delete = function (item) {
        };
        AdminGroupOpenPageCtrl.prototype.goUp = function (item) {
        };
        AdminGroupOpenPageCtrl.prototype.goDown = function (item) {
        };
        return AdminGroupOpenPageCtrl;
    }());
    AIP.AdminGroupOpenPageCtrl = AdminGroupOpenPageCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("AdminGroupOpenPageCtrl", AIP.AdminGroupOpenPageCtrl);
