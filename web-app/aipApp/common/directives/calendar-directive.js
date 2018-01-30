/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
angular.module('bannerAIPUI').directive('datePicker', ['dateFormatService', '$filter', datePicker]);

/**
 * datePicker used for calender option on form
 * @param service used to get date format for different language (dateFormatService)
 * @param notificationCenterService
 * @param $filter
 * @returns {{restrict: string, require: string, scope: {today: string, date: string, showOn: string, onSelect: string}, link: link}}
 */
function datePicker(dateFormatService, notificationCenterService, $filter) {
    return {
        restrict: "A",
        require: '?ngModel',
        scope: {
            today: "@",
            date: "=",
            showOn: "@",
            onSelect: "&"
        },
        link: function($scope, $ele, $attr, controller) {
            var _onSelect = $scope.onSelect || angular.noop;
            if ($attr.today) {
                dateFormatService.fetchDate().$promise.then(
                    function(response) {
                        dateFormat = response.dateFormat;
                        $ele.val(response.date);
                        controller.$setViewValue($ele.val());
                    }
                )['catch'] = (function(errResponse) {
                    notificationCenterService.displayNotifications(errResponse.message, $scope.notificationErrorType, !$scope.flashNotification);
                    var defCal = $.multicalendar._defaults.defaultCalendar;
                    var todayDate = $.multicalendar._defaults.todaysDates[defCal];
                    var formattedToday;
                    if ($.multicalendar.CALENDAR_GREGORIAN !== defCal) {
                        formattedToday = todayDate.formatDate();
                    } else {
                        var dFormat = $filter('i18n')('js.datepicker.dateFormat');
                        formattedToday = $.multicalendar.formatCDateObject(todayDate, dFormat, defCal);
                    }
                    $ele.val(formattedToday);
                });
            }
            $ele.multiCalendarPicker({
                showOn: $scope.showOn ? $scope.showOn : "button",
                onSelect: function(date) {
                    $scope.$apply(function() {
                        controller.$setViewValue($ele.val());
                        _onSelect(date);
                    });
                }
            });

            $ele.bind("blur", function() {
                var target = $ele.val();
                if (target === "") {
                    $scope.$apply(function() {
                        controller.$setValidity('validDateFormat', true);
                    });
                } else {
                    try {
                        $.multicalendar.parse(target, $.i18n.prop("default.calendar"));
                        $scope.$apply(function() {
                            controller.$setValidity('validDateFormat', true);
                             controller.$setViewValue(target);
                        });
                    } catch (e) {
                        $scope.$apply(function() {
                            controller.$setValidity('validDateFormat', false);
                        });
                    }
                }
            });
        }
    };
}
