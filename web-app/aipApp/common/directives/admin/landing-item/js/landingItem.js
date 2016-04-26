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
            controller: ['$scope', '$attrs', "$state", function($scope, $attrs, $state) {
                if (!$scope.model) {
                    devErorrMessages += "model attribute is required\n";
                }
                $scope.changeState = function(state) {
                    $state.go(state);
                }
            }],
            link: function(scope, elem, attributes, parentController) {

            }
        }
    }]);