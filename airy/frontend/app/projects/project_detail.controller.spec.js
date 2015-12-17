describe('Project detail', function () {
    'use strict';

    var scope;
    var rootScope;
    var buildCtrl;
    var project;
    var $interval;
    var ngDialogMock = {
        open: function (config) {},
    };
    var hotkeysMock = {
        add: function (config) {},
    };
    var airyPopupMock = {
        confirm: function (message, confirmCallback) {
            confirmCallback();
        },
    };
    var airyUserMock = {
        reload: function () {},
    };
    var projectResourceMock = {
        get: function () {
            return {
                success: function (successCallback) {
                    successCallback({project: project});
                },
            };
        },
    };
    var taskResourceMock = {
        delete: function (task) {
            return {
                success: function (successCallback) {
                    successCallback();
                },
            };
        },
    };
    var timeEntryResourceMock = {
        delete: function (timeEntry) {
            return {
                success: function (successCallback) {
                    successCallback({task_total_time: 0});
                },
            };
        },
    };

    beforeEach(module('airy.projectDetail'));
    beforeEach(inject(function ($controller, $rootScope, _$interval_) {
        scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        project = {
            id: 3,
            name: 'test',
            client: {id: 1},
            tasks: [
                {id: 6, time_entries: [{id: 33}]},
                {id: 7, time_entries: [{id: 34}]},
            ],
        };
        $interval = _$interval_;
        buildCtrl = function () {
            return $controller('ProjectDetailController', {
                $scope: scope,
                $stateParams: {projectId: 1, currentStatus: 'open'},
                $rootScope: rootScope,
                $interval: $interval,
                ngDialog: ngDialogMock,
                hotkeys: hotkeysMock,
                airyPopup: airyPopupMock,
                airyUser: airyUserMock,
                projectResource: projectResourceMock,
                taskResource: taskResourceMock,
                timeEntryResource: timeEntryResourceMock,
            });
        };
    }));

    it('should load controller', function () {
        spyOn(projectResourceMock, 'get').and.callThrough();
        buildCtrl();
        expect(projectResourceMock.get).toHaveBeenCalled();
        expect(rootScope.title).toEqual(project.name);
        expect(scope.project).toEqual(project);
        expect(scope.client).toEqual(project.client);
    });

    it('should create task', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        scope.createTask();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should update task', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        scope.updateTask();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should delete task', function () {
        buildCtrl();
        spyOn(taskResourceMock, 'delete').and.callThrough();
        spyOn(projectResourceMock, 'get').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        var task = project.tasks[1];
        scope.deleteTask(task);
        expect(taskResourceMock.delete).toHaveBeenCalled();
        var callArgs = taskResourceMock.delete.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(task.id);
        expect(projectResourceMock.get).toHaveBeenCalled();
        expect(airyUserMock.reload).toHaveBeenCalled();
    });

    it('should toggle timer', function () {
        buildCtrl();
        spyOn(scope, 'createTimeEntry').and.callThrough();
        var task = project.tasks[1];
        scope.toggleTimer(task);
        expect(task.timerData).toBeDefined();
        $interval.flush(1000);
        scope.toggleTimer(task);
        expect(scope.createTimeEntry).toHaveBeenCalled();
        var args = scope.createTimeEntry.calls.argsFor(0);
        expect(args[0]).toEqual(task);
        expect(args[1]).toBeGreaterThan(0);
        expect(task.timerData).toBeUndefined();
    });

    it('should create time entry', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        var task = {id: 43};
        var duration = 600;
        scope.createTimeEntry(task, duration);
        expect(ngDialogMock.open).toHaveBeenCalled();
        var ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
        expect(ngDialogConfig.resolve.task()).toEqual(task);
        expect(ngDialogConfig.resolve.duration()).toEqual(duration);
    });

    it('should update time entry', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        var task = {id: 44};
        var timeEntry = {id: 93};
        scope.updateTimeEntry(task, timeEntry);
        expect(ngDialogMock.open).toHaveBeenCalled();
        var ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
        expect(ngDialogConfig.resolve.task()).toEqual(task);
        expect(ngDialogConfig.resolve.timeEntry()).toEqual(timeEntry);
    });

    it('should delete time entry', function () {
        buildCtrl();
        spyOn(timeEntryResourceMock, 'delete').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        var task = project.tasks[1];
        var timeEntry = task.time_entries[0];
        scope.deleteTimeEntry(task, timeEntry);
        expect(timeEntryResourceMock.delete).toHaveBeenCalled();
        var callArgs = timeEntryResourceMock.delete.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(timeEntry.id);
        expect(task.time_entries.length).toBe(0);
        expect(airyUserMock.reload).toHaveBeenCalled();
    });
});
