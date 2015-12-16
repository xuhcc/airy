(function () {
    'use strict';

    angular
        .module('airy.timeEntryForm')
        .factory('TimeEntryDuration', TimeEntryDuration);

    function TimeEntryDuration() {
        return function (duration) {
            var _duration = moment.duration(duration, 'seconds');

            this.hours = _duration.hours();
            this.minutes = _duration.minutes();

            this.toSeconds = function () {
                _duration = moment.duration({
                    hours: this.hours,
                    minutes: this.minutes,
                });
                return _duration.asSeconds();
            };

            this.increment = function () {
                _duration = moment.duration({
                    hours: this.hours,
                    minutes: this.minutes,
                }).add(30, 'minutes');
                this.hours = _duration.hours();
                this.minutes = _duration.minutes();
            };
        };
    }
})();
