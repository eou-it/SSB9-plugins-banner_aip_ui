/**
 * Created by jshin on 1/21/16.
 */
angular.module('bannercsrui')
    .directive('csrLandingItem', [function() {
        return {
            restrict: 'EA',
            terminal: true,
            scope: {
                model: "=",
                method: "&"
            },
            templateUrl: "../plugins/banner-csr-ui-1.0/csrApp/common/directives/csr-landing-item/template/csrLandingItem.html",
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