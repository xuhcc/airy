import 'tasks/time_entry_form.module.js';

describe('Time entry update', function () {
    'use strict';

    let scope;
    let task;
    let timeEntry;
    let buildCtrl;
    let timeEntryResourceMock = {
        update: function (timeEntry) {
            return {
                success: function (successCallback) {
                    timeEntry.task_total_time = timeEntry.duration;
                    successCallback({time_entry: timeEntry});
                },
            };
        },
    };
    let airyUserMock = {
        reload: function () {},
    };

    beforeEach(module('airy.timeEntryForm'));
    beforeEach(inject(function ($controller, $rootScope, _TimeEntryDuration_) {
        scope = $rootScope.$new();
        scope.closeThisDialog = function () {};
        task = {id: 12};
        timeEntry = {id: 33, task_id: task.id, duration: 600};
        buildCtrl = function () {
            return $controller('TimeEntryUpdateController', {
                $scope: scope,
                timeEntryResource: timeEntryResourceMock,
                airyUser: airyUserMock,
                TimeEntryDuration: _TimeEntryDuration_,
                task: task,
                timeEntry: timeEntry,
            });
        };
    }));

    it('should load controller', function () {
        buildCtrl();
        expect(scope.timeEntry).toEqual(timeEntry);
        expect(scope.formTitle).toBe('Time entry #33');
        expect(scope.duration.hours).toBe(0);
        expect(scope.duration.minutes).toBe(10);
        expect(scope.submitForm).toBeDefined();
    });

    it('should update time entry', function () {
        timeEntry.duration = 3600;
        buildCtrl();
        scope.duration.increment();
        spyOn(timeEntryResourceMock, 'update').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(timeEntryResourceMock.update).toHaveBeenCalled();
        let args = timeEntryResourceMock.update.calls.argsFor(0);
        expect(args[0].duration).toBe(5400);
        expect(args[0].task_id).toBe(task.id);
        expect(task.timeEntriesVisible).toBe(true);
        expect(task.total_time).toBe(5400);
        expect(timeEntry.duration).toEqual(5400);
        expect(airyUserMock.reload).toHaveBeenCalled();
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
