///<reference path="../../../typings/tsd.d.ts"/>
angular.module('I18nAIP', []).
    filter('i18n_aip', function () {
    return function (key, data) {
        var value = _.isUndefined(key) ? key : (window.i18n_aip[key] ? window.i18n_aip[key] : key);
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var regexp = new RegExp('\\{(' + i + ')\\}', "g");
                value = value.replace(regexp, data[i] !== undefined ? data[i] : '');
            }
        }
        return value;
    };
});
