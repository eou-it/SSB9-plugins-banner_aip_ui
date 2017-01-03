///<reference path="../../../typings/tsd.d.ts"/>

angular.module('bannerAIP').
filter('blockProcessItemFilter', function () {
    return function (input, current, generated) {
        var notGenerated = input.filter((item) => {
            if(generated.indexOf(item)===-1) {
                return item;
            }
        });
        if(notGenerated.indexOf(current)===-1) {
            notGenerated.unshift(current);
        }
        return notGenerated;
    };
});