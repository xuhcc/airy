(function () {
    'use strict';
    angular
        .module('airyFilters', [])
        .filter('nl2br', nl2br)
        .filter('time', time)
        .filter('timer', timer);

    function nl2br() {
        return function (data) {
            if (!data) {
                return data;
            }
            return data.replace(/\n\r?/g, '<br>');
        };
    }

    function zfill(value) {
        return ('00' + value.toFixed(0)).substr(-2);
    }

    function time() {
        return function (value) {
            var duration = moment.duration(parseFloat(value), 'hours');
            return duration.hours() + ':' + zfill(duration.minutes());
        };
    }

    function timer() {
        return function (value) {
            var duration = moment.duration(parseFloat(value), 'hours');
            return duration.hours() + ':' + zfill(duration.minutes()) +
                ':' + zfill(duration.seconds());
        };
    }
})();
