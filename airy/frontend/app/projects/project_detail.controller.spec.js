import 'projects/project_detail.module.js';

describe('Project detail', function () {
    'use strict';

    let rootScope;
    let buildCtrl;
    let project;
    let $interval;
    let ngDialogMock = {
        open: function (config) {},
    };
    let hotkeysMock = {
        bindTo: () => {
            return {
                add: () => {},
            };
        },
    };
    let airyPopupMock = {
        confirm: function (message, confirmCallback) {
            confirmCallback();
        },
    };
    let airyUserMock = {
        reload: function () {},
    };
    let airyBreadcrumbsMock;
    let projectResourceMock = {
        retrieve: function (projectId, status) {
            return {
                then: function (successCallback) {
                    successCallback({
                        data: {project: project},
                    });
                },
            };
        },
    };
    let taskResourceMock = {
        toggleStatus: function (task) {
            return {
                then: function (successCallback) {
                    task.is_closed = !task.is_closed;
                    successCallback({
                        data: {task: task},
                    });
                },
            };
        },
        remove: function (task) {
            return {
                then: function (successCallback) {
                    successCallback();
                },
            };
        },
    };
    let timeEntryResourceMock = {
        remove: function (timeEntry) {
            return {
                then: function (successCallback) {
                    successCallback({
                        data: {task_total_time: 0},
                    });
                },
            };
        },
    };

    beforeEach(module('airy.projectDetail'));
    beforeEach(inject(function ($componentController, $rootScope, _$interval_) {
        let scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        airyBreadcrumbsMock = jasmine.createSpyObj('breadcrumbs', ['add']);
        project = {
            id: 3,
            name: 'test',
            client: {id: 1},
            tasks: [
                {id: 6, is_closed: false, time_entries: [{id: 33}]},
                {id: 7, is_closed: false, time_entries: [{id: 34}]},
            ],
        };
        $interval = _$interval_;
        buildCtrl = function () {
            return $componentController('projectDetail', {
                $stateParams: {projectId: project.id, currentStatus: 'open'},
                $scope: scope,
                $rootScope: rootScope,
                $interval: $interval,
                ngDialog: ngDialogMock,
                hotkeys: hotkeysMock,
                airyPopup: airyPopupMock,
                airyUser: airyUserMock,
                airyBreadcrumbs: airyBreadcrumbsMock,
                projectResource: projectResourceMock,
                taskResource: taskResourceMock,
                timeEntryResource: timeEntryResourceMock,
            });
        };
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        spyOn(projectResourceMock, 'retrieve').and.callThrough();
        let ctrl = buildCtrl();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
        expect(projectResourceMock.retrieve).toHaveBeenCalled();
        let callArgs = projectResourceMock.retrieve.calls.argsFor(0);
        expect(callArgs[0]).toEqual(project.id);
        expect(callArgs[1]).toEqual(ctrl.currentStatus);
        expect(ctrl.currentStatus).toBe('open');
        expect(rootScope.title).toEqual(project.name);
        expect(airyBreadcrumbsMock.add).toHaveBeenCalledTimes(2);
        expect(ctrl.project).toEqual(project);
        expect(ctrl.client).toEqual(project.client);
    });

    it('should filter tasks by status', function () {
        let ctrl = buildCtrl();
        spyOn(projectResourceMock, 'retrieve').and.callThrough();
        ctrl.filterByStatus('closed');
        expect(projectResourceMock.retrieve).toHaveBeenCalled();
        let callArgs = projectResourceMock.retrieve.calls.argsFor(0);
        expect(callArgs[0]).toEqual(project.id);
        expect(callArgs[1]).toEqual(ctrl.currentStatus);
        expect(ctrl.currentStatus).toBe('closed');
    });

    it('should create task', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        ctrl.createTask();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should update task', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        ctrl.updateTask();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should delete task', function () {
        let ctrl = buildCtrl();
        spyOn(taskResourceMock, 'remove').and.callThrough();
        spyOn(projectResourceMock, 'retrieve').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        let task = project.tasks[1];
        ctrl.deleteTask(task);
        expect(taskResourceMock.remove).toHaveBeenCalled();
        let callArgs = taskResourceMock.remove.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(task.id);
        expect(projectResourceMock.retrieve).toHaveBeenCalled();
        expect(airyUserMock.reload).toHaveBeenCalled();
    });

    it('should toggle task status', function () {
        let ctrl = buildCtrl();
        spyOn(taskResourceMock, 'toggleStatus').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        let task = project.tasks[1];
        ctrl.toggleStatus(task);
        expect(taskResourceMock.toggleStatus).toHaveBeenCalled();
        let callArgs = taskResourceMock.toggleStatus.calls.argsFor(0);
        expect(task.is_closed).toBe(true);
        expect(airyUserMock.reload).toHaveBeenCalled();
    });

    it('should toggle timer', function (done) {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        let task = project.tasks[1];
        ctrl.toggleTimer(task);
        expect(task.timerData).toBeDefined();
        setTimeout(function () {
            $interval.flush(500);
            ctrl.toggleTimer(task);
            expect(ngDialogMock.open).toHaveBeenCalled();
            let ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
            expect(ngDialogConfig.resolve.task()).toEqual(task);
            expect(ngDialogConfig.resolve.duration()).toBeGreaterThan(0.499);
            expect(task.timerData).toBeUndefined();
            done();
        }, 500);
    });

    it('should create time entry', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        let task = {id: 43};
        let duration = 600;
        ctrl.createTimeEntry(task, duration);
        expect(ngDialogMock.open).toHaveBeenCalled();
        let ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
        expect(ngDialogConfig.resolve.task()).toEqual(task);
        expect(ngDialogConfig.resolve.duration()).toEqual(duration);
    });

    it('should update time entry', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        let task = {id: 44};
        let timeEntry = {id: 93};
        ctrl.updateTimeEntry(task, timeEntry);
        expect(ngDialogMock.open).toHaveBeenCalled();
        let ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
        expect(ngDialogConfig.resolve.task()).toEqual(task);
        expect(ngDialogConfig.resolve.timeEntry()).toEqual(timeEntry);
    });

    it('should delete time entry', function () {
        let ctrl = buildCtrl();
        spyOn(timeEntryResourceMock, 'remove').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        let task = project.tasks[1];
        let timeEntry = task.time_entries[0];
        ctrl.deleteTimeEntry(task, timeEntry);
        expect(timeEntryResourceMock.remove).toHaveBeenCalled();
        let callArgs = timeEntryResourceMock.remove.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(timeEntry.id);
        expect(task.time_entries.length).toBe(0);
        expect(airyUserMock.reload).toHaveBeenCalled();
    });
});
