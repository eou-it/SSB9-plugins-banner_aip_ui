/*******************************************************************************
 Copyright 2018-2021 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
angular.module("cm.timepicker", ['xeTimePickerBox'
    ,'cm.tpls'
]);

angular.module('cm.tpls', ['timepicker.html']);

angular.module("timepicker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("timepicker.html",
        "<ul class=\"xe-timepicker-popup dropdown-menu\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\"><li ng-repeat=\"timeObject in timepicker.list\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"setActive($index);\"><a role=\"option\" ng-click=\"select(timeObject.timeValue);\">{{timeObject.displayTime}}</a></li></ul>");
}]);

(function (angular) {
    'use strict';
    angular.module('xeTimePickerBox', ['ui.bootstrap.position', 'dateParser'])
        .factory('xeTimepickerHelper', ['dateFilter','$dateParser',function (dateFilter, $dateParser) {
        return {
            stringToMinutes: function (str) {
                if (!str) {
                    return null;
                }

                var t = str.match(/(\d+)(h?)/);
                return t[1] ? t[1] * (t[2] ? 60 : 1) : null;
            },

            buildOptionList: function (minTime, maxTime, step, hourFormat12, timeFormat, amLabel, pmLabel) {
                var result = [],
                    i = angular.copy(minTime),
                    strValue = null;
                while (i <= maxTime) {
                    strValue = dateFilter(new Date(i), timeFormat);
                    if (hourFormat12 === 'Y') {
                        strValue = strValue.replace(new RegExp('AM', 'i'), amLabel).replace(new RegExp('PM', 'i'), pmLabel);
                        if(locale.toLowerCase().indexOf("es") == 0)
                            strValue = strValue.replace(new RegExp('a. m.', 'i'), amLabel).replace(new RegExp('p. m.', 'i'), pmLabel);
                        else if(locale.toLowerCase().indexOf("en-ie") == 0)
                            strValue = strValue.replace(new RegExp('a.m.', 'i'), amLabel).replace(new RegExp('p.m.', 'i'), pmLabel);
                    }
                    result.push({timeValue : new Date(i), displayTime: strValue});
                    i.setMinutes(i.getMinutes() + step);
                }

                return result;
            },

            getClosestIndex: function (value, from, input24HrString, timeFormat24) {
                var closest = null,
                    index = -1,
                    i = 0,
                    current = null,
                    _current = null,
                    _value = null,
                    newValue = null;

                newValue = value;

                if (input24HrString === 'Y') {
                    newValue = $dateParser(value, timeFormat24);
                }

                if (!angular.isDate(newValue)) {
                    return 0;
                }

                _value = newValue.getHours() * 60 + newValue.getMinutes();

                for (i = 0; i < from.length; i = i + 1) {
                    current = from[i].timeValue;
                    _current = current.getHours() * 60 + current.getMinutes();

                    if (closest === null || Math.abs(_current - _value) < Math.abs(closest - _value)) {
                        closest = _current;
                        index = i;
                    }
                }

                return index;
            }
        };
    }])
        .directive('xeTimePickerBox', ['$compile', '$parse', '$timeout', '$document', 'dateFilter', '$log', '$uibPosition', '$dateParser', 'xeTimepickerHelper',
        function ($compile, $parse, $timeout, $document, dateFilter, $log, $position, $dateParser, xeTimepickerHelper) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    ngModel: '=',
                    ngModel24Hr: '=?',
                    change: '&'
                },
                replace: true,
                link: function (scope, element, attrs, ctrl) {
                    var current = null,
                    //list = [],
                        updateList = true,
                        dropDownElement = null;

                    scope.timepicker = {
                        element: null,
                        timeFormat24: 'HHmm',
                        timeFormat: 'hh:mm a',
                        hourFormat12: 'Y',
                        minTime: $dateParser('0:00', 'H:mm'),
                        maxTime: $dateParser('23:59', 'H:mm'),
                        step: 30,
                        input24HrString: 'N',
                        amLabel: 'AM',
                        pmLabel: 'PM',
                        isOpen: false,
                        activeIdx: -1,
                        list: [],
                        optionList: function () {
                            if (updateList) {
                                scope.timepicker.list = xeTimepickerHelper.buildOptionList(scope.timepicker.minTime, scope.timepicker.maxTime, scope.timepicker.step, scope.timepicker.hourFormat12, scope.timepicker.timeFormat, scope.timepicker.amLabel, scope.timepicker.pmLabel);
                                updateList = false;
                            }
                            return scope.timepicker.list;
                        }
                    };

                    function setCurrentValue(value) {
                        if (!angular.isDate(value)) {

                            value = $dateParser(scope.ngModel, scope.timepicker.timeFormat);
                        }

                        current = value;
                    }

                    function getUpdatedDate(date) {
                        if (!current) {
                            current = angular.isDate(scope.ngModel) ? scope.ngModel : new Date();
                        }

                        current.setHours(date.getHours());
                        current.setMinutes(date.getMinutes());
                        current.setSeconds(date.getSeconds());

                        setCurrentValue(current);

                        return current;
                    }

                    attrs.$observe('hourFormat12', function (value) {
                        if (!value) {
                            return;
                        }

                        scope.timepicker.timeFormat = value === 'N' ? 'HH:mm' : 'hh:mm a';
                        scope.timepicker.hourFormat12 = value;
                        updateList = true;
                    });

                    attrs.$observe('minTime', function (value) {
                        if (!value) {
                            return;
                        }

                        scope.timepicker.minTime = $dateParser(value, scope.timepicker.timeFormat);
                        updateList = true;
                    });

                    attrs.$observe('maxTime', function (value) {
                        if (!value) {
                            return;
                        }

                        scope.timepicker.maxTime = $dateParser(value, scope.timepicker.timeFormat);
                        updateList = true;
                    });

                    attrs.$observe('step', function (value) {
                        if (!value) {
                            return;
                        }

                        var step = xeTimepickerHelper.stringToMinutes(value);
                        if (step) {
                            scope.timepicker.step = step;
                        }

                        updateList = true;
                    });

                    attrs.$observe('input24HrString', function (value) {
                        if (!value) {
                            return;
                        }

                        scope.timepicker.input24HrString = value;
                        updateList = true;
                    });

                    attrs.$observe('amLabel', function (value) {
                        if (!value) {
                            return;
                        }

                        scope.timepicker.amLabel = value;
                        updateList = true;
                    });

                    attrs.$observe('pmLabel', function (value) {
                        if (!value) {
                            return;
                        }

                        scope.timepicker.pmLabel = value;
                        updateList = true;
                    });

                    scope.amPmToLocale = function (value) {
                        var strString = value;
                        if (scope.timepicker.hourFormat12 === 'Y') {
                            strString = value.replace(new RegExp('AM', 'i'), scope.timepicker.amLabel).replace(new RegExp('PM', 'i'), scope.timepicker.pmLabel);
                            if(locale.toLowerCase().indexOf("es") == 0)
                                strString = value.replace(new RegExp('a. m.', 'i'), scope.timepicker.amLabel).replace(new RegExp('p. m.', 'i'), scope.timepicker.pmLabel);
                            else if(locale.toLowerCase().indexOf("en-ie") == 0)
                                strString = value.replace(new RegExp('a.m.', 'i'), scope.timepicker.amLabel).replace(new RegExp('p.m.', 'i'), scope.timepicker.pmLabel);

                        }
                        return strString;
                    };

                    scope.loacletoAmPm = function (value) {
                        var strString = value;
                        if (scope.timepicker.hourFormat12 === 'Y') {
                            strString = value.replace(new RegExp(scope.timepicker.amLabel, 'i'), 'AM').replace(new RegExp(scope.timepicker.pmLabel, 'i'), 'PM');
                            if(locale.toLowerCase().indexOf("es") == 0)
                                strString = value.replace(new RegExp('a. m.', 'i'), scope.timepicker.amLabel).replace(new RegExp('p. m.', 'i'), scope.timepicker.pmLabel);
                            else if(locale.toLowerCase().indexOf("en-ie") == 0)
                                strString = value.replace(new RegExp('a.m.', 'i'), scope.timepicker.amLabel).replace(new RegExp('p.m.', 'i'), scope.timepicker.pmLabel);
                        }
                        return strString;
                    };

                    scope.toDateStringLocale = function (value) {
                        return scope.amPmToLocale(dateFilter(value, scope.timepicker.timeFormat));
                    };

                    // Set up renderer and parser
                    ctrl.$render = function () {
                        if (angular.isDate(current)) {
                            element.val(scope.toDateStringLocale(current));
                            scope.ngModel24Hr = dateFilter(current, scope.timepicker.timeFormat24);
                            if (scope.timepicker.input24HrString === 'Y') {
                                scope.ngModel = dateFilter(current, scope.timepicker.timeFormat24);
                            }
                        } else if (ctrl.$viewValue) {
                            element.val(scope.formatTime(ctrl.$viewValue));
                            scope.ngModel24Hr = null;
                        } else {
                            element.val('');
                        }
                    };

                    // Parses manually entered time
                    ctrl.$parsers.unshift(function (viewValue) {
                        var date = null,
                            formatValue = scope.formatTime(viewValue),
                            formatValueDate = null;

                        formatValueDate = scope.loacletoAmPm(formatValue);
                        date = angular.isDate(formatValueDate) ? formatValueDate : $dateParser(formatValueDate, scope.timepicker.timeFormat);
                        ctrl.$setValidity('time', true);
                        element.val(formatValueDate);
                        ctrl.$setViewValue(formatValueDate);
                        if (isNaN(date)) {
                            if (viewValue.length > 0) {
                                ctrl.$setValidity('time', false);
                            }
                            scope.ngModel24Hr = null;
                            ctrl.$render();
                            return '';
                        }

                        ctrl.$setValidity('time', true);
                        scope.setClosePopupClass();
                        return getUpdatedDate(date);
                    });

                    // Set up methods

                    scope.formatTime = function (value) {
                        var strvalue = value;
                        if (strvalue.length === 4 && strvalue.match(/(\d{2})(\d{2})/)) {
                            strvalue = strvalue.replace(/(\d{2})(\d{2})/, "$1" + ":" + "$2");
                        } else if (strvalue.length === 4 && strvalue.match(/(\d{1})[:](\d{2})/)) {
                            strvalue = '0' + strvalue;
                        }
                        return strvalue;
                    };

                    // Select action handler
                    scope.select = function (time) {
                        scope.setClosePopupClass();
                        if (!angular.isDate(getUpdatedDate(time))) {
                            return;
                        }
                        ctrl.$setViewValue(dateFilter(getUpdatedDate(time), scope.timepicker.timeFormat));
                        ctrl.$render();
                        scope.change();
                    };

                    // Checks for current active item
                    scope.isActive = function (index) {
                        return index === scope.timepicker.activeIdx;
                    };

                    // Sets the current active item
                    scope.setActive = function (index) {
                        scope.timepicker.activeIdx = index;
                    };

                    // Sets the timepicker scrollbar so that selected item is visible
                    scope.scrollToSelected = function () {

                        if (scope.timepicker.element && scope.timepicker.activeIdx > -1) {
                            $timeout(function () {
                                var target = scope.timepicker.element[0].querySelector('.active');
                                if (target) {
                                    target.parentNode.scrollTop = target.offsetTop - 50;
                                }
                            }, 100);
                        }
                    };

                    scope.setOpenPopupClass = function () {
                        element.next().children().removeClass('xe-timepicker-display-none');
                        element.next().children().addClass('xe-timepicker-display-block');
                        scope.timepicker.element = element.next().children();
                    };

                    scope.setClosePopupClass = function () {
                        element.next().children().removeClass('xe-timepicker-display-block');
                        element.next().children().addClass('xe-timepicker-display-none');
                        scope.timepicker.isOpen = false;
                        scope.timepicker.activeIdx = -1;
                    };


                    // Opens the timepicker
                    scope.openPopup = function () {
                        // Set position
                        scope.position = $position.position(element);
                        scope.position.top = scope.position.top + element.prop('offsetHeight');

                        // Open list
                        scope.timepicker.isOpen = true;
                        scope.setOpenPopupClass();

                        // Set active item
                        scope.timepicker.activeIdx = xeTimepickerHelper.getClosestIndex(scope.ngModel, scope.timepicker.optionList(), scope.timepicker.input24HrString, scope.timepicker.timeFormat24);

                        // Trigger apply
                        scope.$apply();

                        // Scroll to selected
                        scope.scrollToSelected();
                    };

                    // Append timepicker dropdown
                    dropDownElement = angular.element('<span ng-include="\'timepicker.html\'"></span>');

                    element.after($compile(dropDownElement)(scope));

                    // Set up the element
                    element
                        .bind('focus', function () {
                            scope.openPopup();
                        })
                        .bind('click', function () {
                            scope.openPopup();
                        })
                        .on('keydown', function (e) {
                            if (e.which === 38 && scope.timepicker.activeIdx > 0) { // UP
                                scope.timepicker.activeIdx = scope.timepicker.activeIdx - 1;
                                scope.scrollToSelected();
                            } else if (e.which === 40 && scope.timepicker.activeIdx < scope.timepicker.list.length - 1) { // DOWN
                                scope.timepicker.activeIdx = scope.timepicker.activeIdx + 1;
                                scope.scrollToSelected();
                            } else if (e.which === 13 && scope.timepicker.activeIdx > -1 && scope.timepicker.isOpen) { // ENTER
                                scope.select(scope.timepicker.list[scope.timepicker.activeIdx].timeValue);
                                scope.setClosePopupClass();
                            } else if (e.which === 27) { // ESC
                                scope.setClosePopupClass();
                            } else if (e.which === 9) { //TAB
                                scope.setClosePopupClass();
                            }
                            scope.$apply();
                        });

                    // Close popup when clicked anywhere else in document
                    $document.bind('click', function (event) {
                        if (scope.timepicker.isOpen && event.target !== element[0]) {
                            scope.setClosePopupClass();
                        }
                    });

                    scope.$on('$destroy', function () {
                        element.off('blur');
                        element.off('focus');
                        element.off('click');
                        $document.off('click');
                    });

                    // Set initial value
                    setCurrentValue(scope.ngModel);
                    element.addClass('xe-timepicker-input-field');
                    scope.setClosePopupClass();
                    $timeout(function () {
                        scope.$watch('ngModel', function (value) {
                            var strValue = null;
                            if (scope.timepicker.input24HrString === 'Y') {
                                strValue = $dateParser(value, scope.timepicker.timeFormat24);
                            } else {
                                strValue = value;
                            }
                            setCurrentValue(strValue);
                            ctrl.$render();
                        });
                    }, 100);
                }
            };
        }]);
}(angular));
