describe('Time entry form controller', function () {
    'use strict';

    var scope;
    var buildCtrl;
    var timeEntryResourceMock = {
        create: function (timeEntry) {
            return {
                success: function (successCallback) {},
            };
        },
        update: function (timeEntry) {
            return {
                success: function (successCallback) {},
            };
        },
    };

    beforeEach(module('airy.timeEntryForm'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        buildCtrl = function () {
            return $controller('TimeEntryFormController', {
                $scope: scope,
                timeEntryResource: timeEntryResourceMock,
                airyUser: {},
            });
        };
    }));

    it('should show hours and minutes', function () {
        scope.ngDialogData = {
            timeEntry: {duration: 4680},
            task: {id: 1},
        };
        buildCtrl();
        expect(scope.time.hours).toBe(1);
        expect(scope.time.minutes).toBe(18);
    });

    it('should add 30 minutes', function () {
        scope.ngDialogData = {
            timeEntry: {},
            task: {id: 1},
        };
        buildCtrl();
        expect(scope.time).toBeUndefined();
        scope.incrementDuration();
        expect(scope.time.hours).toBe(0);
        expect(scope.time.minutes).toBe(30);

        scope.time.minutes = 59;
        scope.incrementDuration();
        expect(scope.time.hours).toBe(1);
        expect(scope.time.minutes).toBe(29);
    });

    it('should create time entry', function () {
        scope.ngDialogData = {
            timeEntry: {},
            task: {id: 3},
        };
        buildCtrl();
        scope.time = {hours: 1, minutes: 30};
        spyOn(timeEntryResourceMock, 'create').and.callThrough();
        scope.submitForm();
        expect(timeEntryResourceMock.create).toHaveBeenCalled();
        var timeEntry = timeEntryResourceMock.create.calls.argsFor(0)[0];
        expect(timeEntry.duration).toBe(5400);
        expect(timeEntry.task_id).toBe(3);
    });

    it('should update time entry', function () {
        scope.ngDialogData = {
            timeEntry: {id: 1, duration: 3600},
            task: {id: 5},
        };
        buildCtrl();
        scope.incrementDuration();
        spyOn(timeEntryResourceMock, 'update').and.callThrough();
        scope.submitForm();
        expect(timeEntryResourceMock.update).toHaveBeenCalled();
        var timeEntry = timeEntryResourceMock.update.calls.argsFor(0)[0];
        expect(timeEntry.duration).toBe(5400);
        expect(timeEntry.task_id).toBe(5);
    });
});
