/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 *******************************************************************************/
(function () {
    var key;

    function patchXHR(fnName, newFn) {
        window.XMLHttpRequest.prototype[fnName] = newFn(window.XMLHttpRequest.prototype[fnName]);
    }

    if (window.XMLHttpRequest && !window.XMLHttpRequest.__isFileAPIShim) {
        patchXHR('setRequestHeader', function (orig) {
            return function (header, value) {
                if (header === '__setXHR_') {
                    var val = value(this);
                    // fix for angular < 1.2.0
                    if (val instanceof Function) {
                        val(this);
                    }
                } else {
                    orig.apply(this, arguments);
                }
            };
        });
    }
    var ngFileUpload = angular.module('ngFileUpload', []);
    ngFileUpload.version = '4.2.4';
    ngFileUpload.service('Upload', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
        function sendHttp(config) {
            config.method = config.method || 'POST';
            config.headers = config.headers || {};
            config.transformRequest = config.transformRequest || function (data, headersGetter) {
                if (window.ArrayBuffer && data instanceof window.ArrayBuffer) {
                    return data;
                }
                return $http.defaults.transformRequest[0](data, headersGetter);
            };
            var deferred = $q.defer();
            var promise = deferred.promise;
            config.headers['__setXHR_'] = function () {
                return function (xhr) {
                    if (!xhr) {
                        return;
                    }
                    config.__XHR = xhr;
                    config.xhrFn && config.xhrFn(xhr);
                    xhr.upload.addEventListener('progress', function (e) {
                        e.config = config;
                        deferred.notify ? deferred.notify(e) : promise.progress_fn && $timeout(function () {
                            promise.progress_fn(e);
                        });
                    }, false);
                    //fix for firefox not firing upload progress end, also IE8-9
                    xhr.upload.addEventListener('load', function (e) {
                        if (e.lengthComputable) {
                            e.config = config;
                            deferred.notify ? deferred.notify(e) : promise.progress_fn && $timeout(function () {
                                promise.progress_fn(e);
                            });
                        }
                    }, false);
                };
            };
            $http(config).then(function (r) {
                deferred.resolve(r);
            }, function (e) {
                deferred.reject(e);
            }, function (n) {
                deferred.notify(n);
            });
            promise.success = function (fn) {
                promise.then(function (response) {
                    fn(response.data, response.status, response.headers, config);
                });
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, function (response) {
                    fn(response.data, response.status, response.headers, config);
                });
                return promise;
            };
            promise.progress = function (fn) {
                promise.progress_fn = fn;
                promise.then(null, null, function (update) {
                    fn(update);
                });
                return promise;
            };
            promise.abort = function () {
                if (config.__XHR) {
                    $timeout(function () {
                        config.__XHR.abort();
                    });
                }
                return promise;
            };
            promise.xhr = function (fn) {
                config.xhrFn = (function (origXhrFn) {
                    return function () {
                        origXhrFn && origXhrFn.apply(promise, arguments);
                        fn.apply(promise, arguments);
                    };
                })(config.xhrFn);
                return promise;
            };
            return promise;
        }

        this.upload = function (config) {
            config.headers = config.headers || {};
            config.headers['Content-Type'] = undefined;
            config.transformRequest = config.transformRequest ?
                (angular.isArray(config.transformRequest) ?
                    config.transformRequest : [config.transformRequest]) : [];
            config.transformRequest.push(function (data) {
                var formData = new FormData();
                var allFields = {};
                for (key in config.fields) {
                    if (config.fields.hasOwnProperty(key)) {
                        allFields[key] = config.fields[key];
                    }
                }
                if (data) {
                    allFields['data'] = data;
                }

                if (config.formDataAppender) {
                    for (key in allFields) {
                        if (allFields.hasOwnProperty(key)) {
                            config.formDataAppender(formData, key, allFields[key]);
                        }
                    }
                } else {
                    for (key in allFields) {
                        if (allFields.hasOwnProperty(key) && allFields[key] !== undefined) {
                            var val = angular.isDate(allFields[key]) ? allFields[key].toISOString() : allFields[key];
                            if (angular.isString(val)) {
                                formData.append(key, val);
                            } else if (config.sendObjectsAsJsonBlob && angular.isObject(val)) {
                                formData.append(key, new Blob([val], {type: 'application/json'}));
                            } else {
                                formData.append(key, JSON.stringify(val));
                            }
                        }
                    }
                }

                if (config.file != null) {
                    var fileFormName = config.fileFormDataName || 'file';

                    if (angular.isArray(config.file)) {
                        var isFileFormNameString = angular.isString(fileFormName);
                        for (var i = 0; i < config.file.length; i++) {
                            formData.append(isFileFormNameString ? fileFormName : fileFormName[i], config.file[i],
                                    (config.fileName && config.fileName[i]) || config.file[i].name);
                        }
                    } else {
                        formData.append(fileFormName, config.file, config.fileName || config.file.name);
                    }
                }
                return formData;
            });

            return sendHttp(config);
        };

        this.http = function (config) {
            return sendHttp(config);
        };
    }]);

    ngFileUpload.directive('ngfSelect', ['$parse', '$timeout', '$compile',
        function ($parse, $timeout, $compile) {
            return {
                restrict: 'AEC',
                require: '?ngModel',
                link: function (scope, elem, attr, ngModel) {
                    linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile);
                }
            };
        }]);

    function linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile) {
        if (elem.attr('__ngf_gen__')) {
            return;
        }
        function isInputTypeFile() {
            return elem[0].tagName.toLowerCase() === 'input' && elem.attr('type') && elem.attr('type').toLowerCase() === 'file';
        }

        var isUpdating = false;

        function changeFn(evt) {
            if (!isUpdating) {
                isUpdating = true;
                try {
                    var fileList = evt.__files_ || (evt.target && evt.target.files);
                    var files = [];
                    var rejFiles = [];
                    for (var i = 0; i < fileList.length; i++) {
                        var file = fileList.item(i);
                        if (validate(scope, $parse, attr, file, evt)) {
                            files.push(file);
                        } else {
                            rejFiles.push(file);
                        }
                    }
                    updateModel($parse, $timeout, scope, ngModel, attr, attr.ngfChange || attr.ngfSelect, files, rejFiles, evt);
                    if (files.length === 0) {
                        evt.target.value = files;
                    }
                } finally {
                    isUpdating = false;
                }
            }
        }

        function bindAttrToFileInput(fileElem) {
            if (attr.ngfMultiple) {
                fileElem.attr('multiple', $parse(attr.ngfMultiple)(scope));
            }
            if (!$parse(attr.ngfMultiple)(scope)) {
                fileElem.attr('multiple', undefined);
            }
            if (attr['accept']) {
                fileElem.attr('accept', attr['accept']);
            }
            if (attr.ngfCapture) {
                fileElem.attr('capture', $parse(attr.ngfCapture)(scope));
            }
            for (var i = 0; i < elem[0].attributes.length; i++) {
                var attribute = elem[0].attributes[i];
                var condition1 = attribute.name !== 'type' && attribute.name !== 'class';
                var condition2 = attribute.name !== 'id' && attribute.name !== 'style';
                var checkAttributeType = condition1 && condition2;
                var checkInputFileType = isInputTypeFile() && attribute.name !== 'type';
                if (checkInputFileType || checkAttributeType) {
                    fileElem.attr(attribute.name, attribute.value);
                }
            }
        }

        function createFileInput() {
            if (elem.attr('disabled')) {
                return;
            }
            var fileElem = angular.element('<input type="file">');
            bindAttrToFileInput(fileElem);

            if (isInputTypeFile()) {
                elem.replaceWith(fileElem);
                elem = fileElem;
                fileElem.attr('__ngf_gen__', true);
                $compile(elem)(scope);
            } else {
                fileElem.css('visibility', 'hidden').css('position', 'absolute')
                    .css('width', '1').css('height', '1').css('z-index', '-100000')
                    .attr('tabindex', '-1');
                if (elem.__ngf_ref_elem__) {
                    elem.__ngf_ref_elem__.remove();
                }
                elem.__ngf_ref_elem__ = fileElem;
                document.body.appendChild(fileElem[0]);
            }
            return fileElem;
        }

        function resetModel(evt) {
            updateModel($parse, $timeout, scope, ngModel, attr, attr.ngfChange || attr.ngfSelect, [], [], evt, true);
        }

        function clickHandler(evt) {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            var fileElem = createFileInput();

            function clickAndAssign(evt) {
                if (evt) {
                    fileElem[0].click();
                }
                if (isInputTypeFile()) {
                    elem.bind('click touchend', clickHandler);
                }
            }
            if (fileElem) {
                fileElem.bind('change', changeFn);
                if (evt) {
                    resetModel(evt);
                }
                // fix for android native browser
                if (navigator.userAgent.toLowerCase().match(/android/)) {
                    setTimeout(function () {
                        clickAndAssign(evt);
                    }, 0);
                } else {
                    clickAndAssign(evt);
                }
            }
            return false;
        }

        if (window.FileAPI && window.FileAPI.ngfFixIE) {
            window.FileAPI.ngfFixIE(elem, createFileInput, bindAttrToFileInput, changeFn, resetModel);
        } else {
            clickHandler();
            if (!isInputTypeFile()) {
                elem.bind('click touchend', clickHandler);
            }
        }
    }

    function updateModel($parse, $timeout, scope, ngModel, attr, fileChange, files, rejFiles, evt, noDelay) {
        function update() {
            if (ngModel) {
                $parse(attr.ngModel).assign(scope, files);
                $timeout(function () {
                    ngModel && ngModel.$setViewValue(files !== null && files.length === 0 ? null : files);
                });
            }
            if (attr.ngModelRejected) {
                $parse(attr.ngModelRejected).assign(scope, rejFiles);
            }
            if (fileChange) {
                $parse(fileChange)(scope, {
                    $files: files,
                    $rejectedFiles: rejFiles,
                    $event: evt
                });
            }
        }

        if (noDelay) {
            update();
        } else {
            $timeout(function () {
                update();
            });
        }
    }

    function getFileMaxSize(scope, $parse, attr, file, evt){
        return $parse(attr.ngfMaxSize)(scope, {$file: file, $event: evt}) || 9007199254740991;
    }

    function getFileMinSize(scope, $parse, attr, file, evt){
        return $parse(attr.ngfMinSize)(scope, {$file: file, $event: evt}) || -1;
    }
    function validate(scope, $parse, attr, file, evt) {
        var accept = $parse(attr.ngfAccept)(scope, {$file: file, $event: evt});
        var fileSizeMax = getFileMaxSize(scope, $parse, attr, file, evt);
        var fileSizeMin = getFileMinSize(scope, $parse, attr, file, evt);
        if (accept != null && angular.isString(accept)) {
            var regexp = new RegExp(globStringToRegex(accept), 'gi');
            accept = (file.type != null && regexp.test(file.type.toLowerCase())) ||
                (file.name != null && regexp.test(file.name.toLowerCase()));
        }
        var fileSizeFlag = file.size < fileSizeMax && file.size > fileSizeMin;
        return (accept == null || accept) && (file.size == null || fileSizeFlag);
    }

    function globStringToRegex(str) {
        if (str.length > 2 && str[0] === '/' && str[str.length - 1] === '/') {
            return str.substring(1, str.length - 1);
        }
        var split = str.split(','), result = '';
        if (split.length > 1) {
            for (var i = 0; i < split.length; i++) {
                result += '(' + globStringToRegex(split[i]) + ')';
                if (i < split.length - 1) {
                    result += '|';
                }
            }
        } else {
            if (str.indexOf('.') === 0) {
                str = '*' + str;
            }
            result = '^' + str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '-]', 'g'), '\\$&') + '$';
            result = result.replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
        }
        return result;
    }
})();
