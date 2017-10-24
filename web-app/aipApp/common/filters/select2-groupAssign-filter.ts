///<reference path="../../../typings/tsd.d.ts"/>

angular.module('bannerAIP').
filter('groupAssignFilter', function () {
    return function (input, index, assigned, selected) {
        var notGenerated = input.filter((item) => {
            if(item === selected[index]) {
                return item;
            }
            var isAssigned = assigned.filter((_item) => {
                return _item.actionItemId===item.actionItemId && _item.actionItemFolderId===item.folderId;
            });
            if(isAssigned.length===0) {
                return item;
            }
        });
        return notGenerated;
    };
});