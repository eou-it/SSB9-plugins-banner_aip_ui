///<reference path="../../../typings/tsd.d.ts"/>

angular.module('bannerAIP').
filter('groupAssignFilter', function () {
    return function (input, index, assigned, selected) {
        var notGenerated = input.filter((item) => {
            if(item.actionItemId === selected[index].actionItemId && item.folderId === selected[index].folderId) {
                return item;
            }
            var isAssigned = selected.filter((_item) => {
                return _item.actionItemId===item.actionItemId && _item.folderId===item.folderId;
            });
            if(isAssigned.length===0) {
                return item;
            }
        });
        notGenerated.sort((a,b) => {
            if (a.actionItemTitle < b.actionItemTitle) {
                return -1;
            }
            if (a.actionItemTitle > b.actionItemTitle) {
                return 1
            }
            return 0;
        })
        return notGenerated;
    };
});