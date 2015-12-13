(function () {
    'use strict';

    angular
        .module('airy.header')
        .directive('airyHeader', airyHeader);

    function airyHeader(airyUser) {
        return {
            restrict: 'A',
            templateUrl: 'static/partials/header.html',
            scope: {},
            link: function (scope, element) {
                scope.user = airyUser.user;
            },
        };
    }
})();
