/**
 * Created by jshin on 1/21/16.
 */
angular.module('bannercsr')
    .directive('csrLandingItem', [function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                model: "="
            },
            templateUrl: "../plugins/banner-csr-ui-1.0/csrApp/common/directives/csr-landing-item/csrLandingItem.html",
            controller: ['$scope', '$attrs', "$timeout", function($scope, $attrs, $timeout) {
                if (!$scope.model) {
                    devErorrMessages += "model attribute is required\n";
                }
            }],
            link: function(scope, elem, attributes, parentController) {
            }
        }
    }]);