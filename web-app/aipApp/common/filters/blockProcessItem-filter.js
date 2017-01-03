///<reference path="../../../typings/tsd.d.ts"/>
angular.module('bannerAIP').
    filter('blockProcessItemFilter', function () {
    return function (input, current, generated) {
        var notGenerated = input.filter(function (item) {
            if (generated.indexOf(item) === -1) {
                return item;
            }
        });
        if (notGenerated.indexOf(current) === -1) {
            notGenerated.unshift(current);
        }
        return notGenerated;
    };
});
//# sourceMappingURL=blockProcessItem-filter.js.map