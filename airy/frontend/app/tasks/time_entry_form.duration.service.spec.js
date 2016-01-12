import 'tasks/time_entry_form.module.js';

describe('Time entry duration service', function () {
    'use strict';

    let TimeEntryDuration;

    beforeEach(module('airy.timeEntryForm'));
    beforeEach(inject(function (_TimeEntryDuration_) {
        TimeEntryDuration = _TimeEntryDuration_;
    }));

    it('should convert between different representations', function () {
        let duration = new TimeEntryDuration(5940);
        expect(duration.hours).toBe(1);
        expect(duration.minutes).toBe(39);
        expect(duration.toSeconds()).toBe(5940);
    });

    it('should round the value from timer', function () {
        let duration1 = new TimeEntryDuration(89);
        expect(duration1.minutes).toBe(1);
        expect(duration1.toSeconds()).toBe(60);
        let duration2 = new TimeEntryDuration(90);
        expect(duration2.minutes).toBe(2);
        expect(duration2.toSeconds()).toBe(120);
    });

    it('should add 30 minutes', function () {
        let duration = new TimeEntryDuration(0);
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
