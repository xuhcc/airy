(function () {
    'use strict';

    angular
        .module('airy.header')
        .directive('airyHeader', airyHeader);

    function airyHeader(airyUser) {
        var directive = {
            restrict: 'A',
            templateUrl: 'static/partials/header.html',
            scope: {},
            link: link,
        };
        return directive;

        function link(scope, element) {
            scope.user = airyUser.user;
        }
    }
})();
