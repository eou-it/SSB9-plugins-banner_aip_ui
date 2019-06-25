
/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
angular.module('bannerAIPUI')
    .directive('aipLandingItem', [function() {
        return {
            restrict: 'EA',
            terminal: true,
            scope: {
                model: "=",
                method: "&"
            },
            controller: ['$scope', '$attrs', "$state","$http","$q","$filter","BCM_ROOT", function($scope, $attrs, $state,$http,$q,$filter,BCM_ROOT) {
                if (!$scope.model) {
                    var devErrorMessages;
                    devErrorMessages += "model attribute is required\n";
                }
                $scope.model.filteredDescription = $filter('i18n_aip')($scope.model.description).split("//br");
                $scope.changeState = function(state) {
                    var deferred = $q.defer();
                    $http.get(BCM_ROOT + "/BCM/getBCMLocation")
                        .then(function (response) {
                            $scope.bcm = response.data.bcmURL;
                            if (state == "admin-manage-list") {
                                $scope.bcm += response.data.mepCode? "?mepCode="+response.data.mepCode:"";
                                window.open($scope.bcm);
                            }
                            $state.go(state)
                            deferred.resolve(response.data);
                        }).catch(function (data) {
                        //Handle Error
                        deferred.reject(data);
                    });
                }
            }],
            link: function(scope, elem, attributes, parentController) {

            }
        }
    }]);
