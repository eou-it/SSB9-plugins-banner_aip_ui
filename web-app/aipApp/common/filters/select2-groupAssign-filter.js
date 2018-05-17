/*******************************************************************************
 Copyright 2018 Ellucian Company L.P. and its affiliates.
 ********************************************************************************/
///<reference path="../../../typings/tsd.d.ts"/>
//angular.module('bannerAIP').
angular.module('bannerCommonAIP').
    filter('groupAssignFilter', function () {
    return function (input, index, assigned, selected) {
        var notGenerated = input.filter(function (item) {
            if (item.actionItemId === selected[index].actionItemId && item.folderId === selected[index].folderId) {
                return item;
            }
            var isAssigned = selected.filter(function (_item) {
                return _item.actionItemId === item.actionItemId && _item.folderId === item.folderId;
            });
            if (isAssigned.length === 0) {
                return item;
            }
        });
        notGenerated.sort(function (a, b) {
            if (a.folderName.toLowerCase() < b.folderName.toLowerCase()) {
                return -1;
            }
            if (a.folderName.toLowerCase() > b.folderName.toLowerCase()) {
                return 1;
            }
            if (a.actionItemName.toLowerCase() < b.actionItemName.toLowerCase()) {
                return -1;
            }
            if (a.actionItemName.toLowerCase() > b.actionItemName.toLowerCase()) {
                return 1;
            }
            return 0;
        });
        return notGenerated;
    };
});
