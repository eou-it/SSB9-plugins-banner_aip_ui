/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../../../../typings/tsd.d.ts"/>


module AIPUI {
    export function AIPStatusRuleDirective() {
        return {
            restrict: "AE",
            transclude: true,
            replace: false,
            scope: {
                rules: "=",
                status: "=",
                attachments: "=",
                inputs: "&",
                ngModel: '=',
                ngChange: '&',
                contentChanged: "=changes"
            },
            compile:function(){},
            link: function (scope, elem, attr, ctrl, transclude) {
                transclude(scope, (clone) => {
                    scope.init();
                });
            },
            controller: function ($scope) {

                $scope.init = function () {
                };

                $scope.addRule = function ($event) {

                    $scope.rules.push(
                        {
                            statusName: "",
                            status: $scope.status[0],
                            allowedAttachments: $scope.attachments[0]
                        }
                    );

                    setTimeout(() => {
                        var btnTarget = $("input#response-" + $scope.rules.length) /*+ $scope.rules.length*/;
                        $(btnTarget).focus();
                    }, 500);

                };
                $scope.getState = function (id) {
                };

                $scope.detectRuleChange = function () {
                    $scope.contentChanged = true;
                };

                $scope.moveUp = function (item, $event) {
                    var idx = $scope.rules.indexOf(item);

                    if (!$scope.isFirst(item)) {
                        var temp = $scope.rules[idx - 1];
                        $scope.rules[idx - 1] = item;
                        $scope.rules[idx] = temp;
                    }

                    var btnTarget = "#order-down-1";

                    if (idx == 1) {
                        setTimeout(() => {
                            $(btnTarget).focus();
                        }, 500);
                    } else {
                        btnTarget = "#order-up-" + idx;
                        setTimeout(() => {
                            $(btnTarget).focus();
                        }, 500);
                    }
                    this.detectRuleChange();
                };
                $scope.moveDown = function (item, $event) {
                    var idx = $scope.rules.indexOf(item);
                    var pos = idx + 1;

                    if (pos == $scope.rules.length - 1) {
                        var btnTarget = "#order-up-" + $scope.rules.length;

                        setTimeout(() => {
                            $(btnTarget).focus();
                        }, 500);
                    }

                    if (!$scope.isLast(item)) {
                        var temp = $scope.rules[idx + 1];
                        $scope.rules[idx + 1] = item;
                        $scope.rules[idx] = temp;
                    }
                    this.detectRuleChange();

                };
                $scope.isLast = function (item) {
                    if ($scope.rules.indexOf(item) === $scope.rules.length - 1) {
                        return true;
                    }
                    return false;
                };
                $scope.isFirst = function (item) {
                    if ($scope.rules.indexOf(item) === 0) {
                        return true;
                    }
                    return false;
                };
                $scope.removeRule = function (item, $event) {
                    var idx = $scope.rules.indexOf(item);

                    var btnTarget;

                    if (idx == 0) {
                        btnTarget = "#delete-" + 1;
                    } else {
                        var futureLen = $scope.rules.length - 1;
                        btnTarget = "#delete-" + futureLen;
                    }

                    if (idx > -1) {
                        $scope.rules.splice(idx, 1);

                        setTimeout(() => {
                            $(btnTarget).focus();
                        }, 500);

                    }
                }
            }
        }
    }
    angular.module('bannerAIPUI').directive('aipStatusRule', [AIPStatusRuleDirective]);
}


