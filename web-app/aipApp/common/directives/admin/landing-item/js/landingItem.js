/**
 * Created by jshin on 1/21/16.
 */
angular.module('bannerAIPUI')
    .directive('aipLandingItem', [function() {
        return {
            restrict: 'EA',
            terminal: true,
            scope: {
                model: "=",
                method: "&"
            },
            controller: ['$scope', '$attrs', "$state","$http","BCM_ROOT", function($scope, $attrs, $state,$http,BCM_ROOT) {
                if (!$scope.model) {
                    devErrorMessages += "model attribute is required\n";
                }
                $scope.changeState = function(state) {
                    $http.get(BCM_ROOT + "/BCM/getBCMLocation").then(function (response) {
                        $scope.bcm = response.data.bcmURL;

                        if (state == "admin-manage-list") {
                            window.open($scope.bcm);
                        }
                        $state.go(state);
                    });
                }
            }],
            link: function(scope, elem, attributes, parentController) {

            }
        }
    }]);