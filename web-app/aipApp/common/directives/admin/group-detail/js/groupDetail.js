angular.module('bannerAIPUI')
    .directive('aipGroupDetail', [function () {
        return {
            restrict: 'EA',
            terminal: true,
            scope: {
                model: "=",
                method: "&"
            },
            controller: ['$scope', '$attrs', "$state", "$filter", function ($scope, $attrs, $state, $filter) {
                    if (!$scope.model) {
                        devErrorMessages += "model attribute is required\n";
                    }
                    $scope.changeState = function (state) {
                        $state.go(state);
                    };
                }],
            link: function (scope, elem, attributes, parentController) {
            }
        };
    }]);
//# sourceMappingURL=groupDetail.js.map