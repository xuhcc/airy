describe('Time entry duration service', function () {
    'use strict';

    var TimeEntryDuration;

    beforeEach(module('airy.timeEntryForm'));
    beforeEach(inject(function (_TimeEntryDuration_) {
        TimeEntryDuration = _TimeEntryDuration_;
    }));

    it('should convert between different representations', function () {
        var duration = new TimeEntryDuration(5940);
        expect(duration.hours).toBe(1);
        expect(duration.minutes).toBe(39);
        expect(duration.toSeconds()).toBe(5940);
    });

    it('should add 30 minutes', function () {
        var duration = new TimeEntryDuration(0);
        expect(duration.hours).toBe(0);
        expect(duration.minutes).toBe(0);
        duration.increment();
        expect(duration.hours).toBe(0);
        expect(duration.minutes).toBe(30);
        duration.minutes = 59;
        duration.increment();
        expect(duration.hours).toBe(1);
        expect(duration.minutes).toBe(29);
    });
});
