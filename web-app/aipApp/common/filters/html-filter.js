///<reference path="../../../typings/tsd.d.ts"/>
angular.module('SCEAIP', []).
    filter('html', ['$sce', function ($sce) {
        return function (val) {
            var elem = document.createElement('div');
            elem.innerHTML = val;
            return elem.childNodes.length === 0 ? '' : elem.childNodes[0].nodeValue;
        };
    }]);
//# sourceMappingURL=html-filter.js.map 
//# sourceMappingURL=html-filter.js.map