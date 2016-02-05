angular.module('I18n', []).
    filter('i18n', function () {
    return function (key, data) {
        var value = _.isUndefined(key) ? key : (window.i18n[key] ? window.i18n[key] : key);
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var regexp = new RegExp('\\{(' + i + ')\\}', "g");
                value = value.replace(regexp, data[i] !== undefined ? data[i] : '');
            }
        }
        return value;
    };
});
//# sourceMappingURL=i18n-filter.js.map