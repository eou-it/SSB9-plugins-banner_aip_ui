///<reference path="../../../typings/tsd.d.ts"/>
angular.module('SCEAIP', []).
    filter('trusted', ['$sce', function ($sce) {
        var div = document.createElement('div');
        return function (text) {
            div.innerHTML = text;
            return $sce.trustAsHtml(div.textContent);
        };
    }]);
//# sourceMappingURL=trusted.js.map 
//# sourceMappingURL=trusted.js.map