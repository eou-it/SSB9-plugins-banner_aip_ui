//<reference path="../../../../typings/tsd.d.ts"/>
var AIP;
(function (AIP) {
    var DataGridCtrl = (function () {
        function DataGridCtrl($scope, $http, $q, $filter, ENDPOINT) {
            $scope.vm = this;
            this.ENDPOINT = ENDPOINT;
            $scope.records = 1;
            $scope.rows = [];
            $scope.fetchData = function (query) {
                var deferred = $q.defer(), url = "";
                url = this.ENDPOINT.admin.groupList + "?";
                '?searchString=' + (query.searchString || '') +
                    '&sortColumnName=' + (query.sortColumnName || '') +
                    '&ascending=' + query.ascending +
                    '&offset=' + (query.offset || '') +
                    '&max=' + (query.max || '');
                $http.get(url)
                    .success(function (data) {
                    deferred.resolve(data);
                    $scope.headings = data.header;
                })
                    .error(function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            };
            $scope.toggleRTL = function () {
                if ($scope.rtl === "xe-ui-components.min") {
                    $scope.rtl = "xe-ui-components-rtl";
                    $scope.rtlText = "Switch to LTR";
                }
                else {
                    $scope.rtl = "xe-ui-components.min";
                    $scope.rtlText = "Switch to RTL";
                }
            };
            /*
             $scope.onDoubleClick = function(data,index) {
             console.log("data-->" , data,index);
             };
             */
            /*
             $scope.onBtnClick = function(data, index) {
             console.log(data, index);
             };
             */
            $scope.model = { allRowsSelected: false };
            /*
             $scope.selectAll = function() {
             console.log('SelectAll checkbox checked: ' + $scope.model.allRowsSelected);
             };
             */
            $scope.selectRecord = function (data) {
                //console.log("select data from grid");
                //console.log(data);
                this.selectedRecord = data;
                $scope.adminGroupService.enableGroupOpen(data.id);
                $scope.$state.params.grp = data.id;
            };
            $scope.refreshData = function () {
                console.log('Refreshing grid data...');
                $scope.refreshGrid(true);
            };
            /*
             $scope.postFetch = function(response, oldResult) {
             console.log('Post fetch handler()');
             };
             */
            $scope.paginationConfig = {
                pageLengths: [5, 10, 25, 50, 100],
                offset: 10,
                recordsFoundLabel: "Results found",
                pageTitle: "Go To Page (End)",
                pageLabel: "Page",
                pageAriaLabel: "Go To Page. Short cut is End",
                ofLabel: "of"
            };
            $scope.searchConfig = {
                id: 'dataTableSearch',
                title: 'Search (Alt+Y)',
                ariaLabel: 'Search text field. Short cut is Alt+Y, Search for any course or section',
                delay: 300,
                searchString: '',
                maxlength: 200,
                minimumCharacters: 2
            };
        }
        DataGridCtrl.$inject = ["$scope", "$http", "$q", "$filter", "ENDPOINT"];
        return DataGridCtrl;
    }());
    AIP.DataGridCtrl = DataGridCtrl;
})(AIP || (AIP = {}));
register("bannerAIP").controller("DataGridCtrl", AIP.DataGridCtrl);
//# sourceMappingURL=dataGridCtrl.js.map