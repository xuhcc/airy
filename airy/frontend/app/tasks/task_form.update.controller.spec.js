import 'tasks/task_form.module.js';

describe('Task update', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let task;

    let hotkeysMock = {
        bindTo: () => {
            return {
                add: () => {},
            };
        },
    };
    let taskResourceMock = {
        update: function (task) {
            return {
                success: function (successCallback) {
                    successCallback({task: task});
                },
            };
        },
    };

    beforeEach(module('airy.taskForm'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.closeThisDialog = function () {};
        task = {id: 5, project_id: 1, name: 't5'};
        buildCtrl = () => $controller('TaskUpdateController', {
            $scope: scope,
            hotkeys: hotkeysMock,
            taskResource: taskResourceMock,
            task: task,
        });
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        let ctrl = buildCtrl();
        expect(ctrl.task).toEqual(task);
        expect(ctrl.formTitle).toEqual('Task #5');
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should update task', function () {
        let ctrl = buildCtrl();
        ctrl.task.title = 'new';
        spyOn(taskResourceMock, 'update').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        ctrl.submitForm();
        expect(taskResourceMock.update).toHaveBeenCalled();
        let callArgs = taskResourceMock.update.calls.argsFor(0);
        expect(callArgs[0].id).toBe(ctrl.task.id);
        expect(callArgs[0].project_id).toBe(ctrl.task.project_id);
        expect(task.title).toBe('new');
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
