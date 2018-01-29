/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

declare var _;

angular.module('I18nAIP', []).
    filter('i18n_aip', function () {
        return function (key, data) {
            var value = _.isUndefined(key) ? key : ((<any>window).i18n_aip[key] ? (<any>window).i18n_aip[key] : key);
            if(data) {
                for(var i=0; i < data.length; i++) {
                    var regexp = new RegExp('\\{('+i+')\\}', "g");
                    value = value.replace(regexp, data[i] !== undefined ? data[i] : '' );
                }
            }
            return value
        };
    });
