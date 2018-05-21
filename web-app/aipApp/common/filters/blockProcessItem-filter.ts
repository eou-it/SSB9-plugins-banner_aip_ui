/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>

angular.module('bannerCommonAIP').
filter('blockProcessItemFilter', function () {
    return function (input, current, generated) {
        var notGenerated = input.filter((item) => {
            var isGenerated = generated.filter((_item) => {
                return _item.name===item.name;}
                );
            if(isGenerated.length===0) {
                return item;
            }
        });
        var isCurrent = notGenerated.filter((_item) => {
            return _item.name===current.name;}
            );
        if(isCurrent.length===0) {
            notGenerated.unshift(current);
        }
        return notGenerated;
    };
});
