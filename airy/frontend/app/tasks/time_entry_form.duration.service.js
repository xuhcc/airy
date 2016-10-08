function TimeEntryDuration() {
    return function (duration) {
        let _duration = moment.duration(duration, 'seconds');

        this.hours = _duration.hours();
        this.minutes = _duration.minutes();

        if (_duration.seconds() >= 30) {
            this.minutes += 1;
        }
        if (this.minutes === 60) {
            this.hours += 1;
            this.minutes = 0;
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
