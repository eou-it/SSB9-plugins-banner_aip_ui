///<reference path="../../../typings/tsd.d.ts"/>
angular.module('bannerAIP').
    filter('blockProcessItemFilter', function () {
    return function (input, current, generated) {
        var notGenerated = input.filter(function (item) {
            var isGenerated = generated.filter(function (_item) {
                return _item.name === item.name;
            });
            if (isGenerated.length === 0) {
                return item;
            }
        });
        var isCurrent = notGenerated.filter(function (_item) {
            return _item.name === current.name;
        });
        if (isCurrent.length === 0) {
            notGenerated.unshift(current);
        }
        return notGenerated;
    };
});
//# sourceMappingURL=blockProcessItem-filter.js.map