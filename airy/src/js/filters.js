(function () {
    'use strict';
    angular
        .module('airyFilters', [])
        .filter('nl2br', nl2br);

    function nl2br() {
        return function (data) {
            if (!data) {
                return data;
            }
            return data.replace(/\n\r?/g, '<br>');
        };
    }
})();
