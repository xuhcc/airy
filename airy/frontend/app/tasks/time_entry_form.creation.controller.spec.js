describe('Time entry creation', function () {
    'use strict';

    var scope;
    var task;
    var duration;
    var buildCtrl;
    var timeEntryResourceMock = {
        create: function (timeEntry) {
            return {
                success: function (successCallback) {
                    timeEntry.task_total_time = timeEntry.duration;
                    successCallback({time_entry: timeEntry});
                },
            };
        },
    };
    var airyUserMock = {
        reload: function () {},
    };

    beforeEach(module('airy.timeEntryForm'));
    beforeEach(inject(function ($controller, $rootScope, _TimeEntryDuration_) {
        scope = $rootScope.$new();
        scope.closeThisDialog = function () {};
        task = {
            id: 19,
            time_entries: [
                {id: 21},
            ],
            timeEntriesVisible: false,
        };
        buildCtrl = function () {
            return $controller('TimeEntryCreationController', {
                $scope: scope,
                timeEntryResource: timeEntryResourceMock,
                airyUser: airyUserMock,
                TimeEntryDuration: _TimeEntryDuration_,
                task: task,
                duration: duration,
            });
        };
    }));

    it('should load controller', function () {
        duration = 4680;
        buildCtrl();
        expect(scope.formTitle).toBe('New time entry');
        expect(scope.timeEntry.task_id).toEqual(task.id);
        expect(scope.duration.hours).toBe(1);
        expect(scope.duration.minutes).toBe(18);
        expect(scope.submitForm).toBeDefined();
    });

    it('should create time entry', function () {
        buildCtrl();
        scope.duration.hours = 1;
        scope.duration.minutes = 30;
        spyOn(timeEntryResourceMock, 'create').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(timeEntryResourceMock.create).toHaveBeenCalled();
        var args = timeEntryResourceMock.create.calls.argsFor(0);
        expect(args[0].duration).toBe(5400);
        expect(args[0].task_id).toBe(task.id);
        expect(task.timeEntriesVisible).toBe(true);
        expect(task.total_time).toBe(5400);
        expect(task.time_entries.length).toBe(2);
        expect(task.time_entries[1]).toEqual(scope.timeEntry);
        expect(airyUserMock.reload).toHaveBeenCalled();
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
