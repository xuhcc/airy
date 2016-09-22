import 'tasks/time_entry_form.module.js';

describe('Time entry creation', function () {
    'use strict';

    let scope;
    let task;
    let duration;
    let buildCtrl;

    let hotkeysMock = {
        bindTo: () => {
            return {
                add: () => {},
            };
        },
    };
    let timeEntryResourceMock = {
        create: function (timeEntry) {
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
                hotkeys: hotkeysMock,
                timeEntryResource: timeEntryResourceMock,
                airyUser: airyUserMock,
                TimeEntryDuration: _TimeEntryDuration_,
                task: task,
                duration: duration,
            });
        };
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        duration = 4680;
        let ctrl = buildCtrl();
        expect(ctrl.formTitle).toBe('New time entry');
        expect(ctrl.timeEntry.task_id).toEqual(task.id);
        expect(ctrl.duration.hours).toBe(1);
        expect(ctrl.duration.minutes).toBe(18);
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should create time entry', function () {
        let ctrl = buildCtrl();
        ctrl.duration.hours = 1;
        ctrl.duration.minutes = 30;
        spyOn(timeEntryResourceMock, 'create').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        ctrl.submitForm();
        expect(timeEntryResourceMock.create).toHaveBeenCalled();
        let args = timeEntryResourceMock.create.calls.argsFor(0);
        expect(args[0].duration).toBe(5400);
        expect(args[0].task_id).toBe(task.id);
        expect(task.timeEntriesVisible).toBe(true);
        expect(task.total_time).toBe(5400);
        expect(task.time_entries.length).toBe(2);
        expect(task.time_entries[1]).toEqual(ctrl.timeEntry);
        expect(airyUserMock.reload).toHaveBeenCalled();
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
