describe('Time entry form', function () {
    'use strict';

    var scope;
    var buildCtrl;
    var timeEntryResourceMock = {
        create: function (timeEntry) {
            return {
                success: function (successCallback) {
                    successCallback({time_entry: {task_total_time: 0}});
                },
            };
        },
        update: function (timeEntry) {
            return {
                success: function (successCallback) {
                    successCallback({time_entry: {task_total_time: 0}});
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
        buildCtrl = function () {
            return $controller('TimeEntryFormController', {
                $scope: scope,
                timeEntryResource: timeEntryResourceMock,
                airyUser: airyUserMock,
                TimeEntryDuration: _TimeEntryDuration_,
            });
        };
    }));

    it('should show hours and minutes', function () {
        scope.ngDialogData = {
            timeEntry: {duration: 4680},
            task: {id: 1},
        };
        buildCtrl();
        expect(scope.duration.hours).toBe(1);
        expect(scope.duration.minutes).toBe(18);
    });

    it('should add 30 minutes', function () {
        scope.ngDialogData = {
            timeEntry: {},
            task: {id: 1},
        };
        buildCtrl();
        expect(scope.duration.hours).toBe(0);
        expect(scope.duration.minutes).toBe(0);
        scope.duration.increment();
        expect(scope.duration.hours).toBe(0);
        expect(scope.duration.minutes).toBe(30);

        scope.duration.minutes = 59;
        scope.duration.increment();
        expect(scope.duration.hours).toBe(1);
        expect(scope.duration.minutes).toBe(29);
    });

    it('should create time entry', function () {
        scope.ngDialogData = {
            timeEntry: {},
            task: {id: 3, time_entries: []},
        };
        buildCtrl();
        scope.duration.hours = 1;
        scope.duration.minutes = 30;
        spyOn(timeEntryResourceMock, 'create').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        scope.submitForm();
        expect(timeEntryResourceMock.create).toHaveBeenCalled();
        var timeEntry = timeEntryResourceMock.create.calls.argsFor(0)[0];
        expect(timeEntry.duration).toBe(5400);
        expect(timeEntry.task_id).toBe(3);
        expect(airyUserMock.reload).toHaveBeenCalled();
    });

    it('should update time entry', function () {
        scope.ngDialogData = {
            timeEntry: {id: 1, duration: 3600},
            task: {id: 5},
        };
        buildCtrl();
        scope.duration.increment();
        spyOn(timeEntryResourceMock, 'update').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        scope.submitForm();
        expect(timeEntryResourceMock.update).toHaveBeenCalled();
        var timeEntry = timeEntryResourceMock.update.calls.argsFor(0)[0];
        expect(timeEntry.duration).toBe(5400);
        expect(timeEntry.task_id).toBe(5);
        expect(airyUserMock.reload).toHaveBeenCalled();
    });
});
