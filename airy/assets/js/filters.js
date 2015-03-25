(function () {
    'use strict';
    angular
        .module('airyFilters', [])
        .filter('nl2br', nl2br)
        .filter('time', time);

    function nl2br() {
        return function (data) {
            if (!data) {
                return data;
            }
            return data.replace(/\n\r?/g, '<br>');
        };
    }

    function time() {
        function zfill(value) {
            return ('00' + value.toFixed(0)).substr(-2);
        }
        return function (value) {
            value = parseFloat(value);
            var hours = Math.floor(value);
            var minutes = (value - hours) * 60;
            return hours + ':' + zfill(minutes);
        };
    }
})();
