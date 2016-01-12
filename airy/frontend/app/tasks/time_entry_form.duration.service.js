function TimeEntryDuration() {
    return function (duration) {
        let _duration = moment.duration(duration, 'seconds');

        this.hours = _duration.hours();
        this.minutes = _duration.minutes();

        if (_duration.seconds() >= 30) {
            this.minutes += 1;
        }

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

export default TimeEntryDuration;
