
declare var angular;
declare var _;

angular.module('I18nCSR', []).
    filter('i18n_csr', function () {
        return function (key, data) {
            var value = _.isUndefined(key) ? key : (window.i18n_csr[key] ? window.i18n_csr[key] : key);
            if(data) {
                for(var i=0; i < data.length; i++) {
                    var regexp = new RegExp('\\{('+i+')\\}', "g");
                    value = value.replace(regexp, data[i] !== undefined ? data[i] : '' );
                }
            }
            return value
        };
    });