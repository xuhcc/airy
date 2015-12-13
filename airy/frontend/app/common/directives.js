(function () {
    'use strict';

    angular
        .module('airy.directives', [])
        .directive('autoFocus', autoFocus);

    function autoFocus($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    element[0].focus();
                }, 10);
            },
        };
    }
})();
