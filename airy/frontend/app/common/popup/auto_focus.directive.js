(function () {
    'use strict';

    angular
        .module('airy.popup')
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
