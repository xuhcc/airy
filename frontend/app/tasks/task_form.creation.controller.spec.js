import './task_form.module.js';

describe('Task creation', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let project;

    let hotkeysMock = {
        bindTo: () => {
            return {
                add: () => {},
            };
        },
    };
    let taskResourceMock = {
        create: function (task) {
            return {
                then: function (successCallback) {
                    successCallback({
                        data: {task: task},
                    });
                },
            };
        },
    };
    let airyUserMock = {
        reload: function () {},
    };

    beforeEach(module('airy.taskForm'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.closeThisDialog = function () {};
        project = {
            id: 10,
            tasks: [
                {title: 't1'},
            ],
        };
        buildCtrl = () => $controller('TaskCreationController', {
            $scope: scope,
            hotkeys: hotkeysMock,
            airyUser: airyUserMock,
            taskResource: taskResourceMock,
            project: project,
        });
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        let ctrl = buildCtrl();
        expect(ctrl.task).toEqual({project_id: project.id});
        expect(ctrl.formTitle).toEqual('New task');
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should create task', function () {
        let ctrl = buildCtrl();
        ctrl.task.title = 't2';
        spyOn(taskResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        ctrl.submitForm();
        expect(taskResourceMock.create).toHaveBeenCalled();
        let callArgs = taskResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].title).toBe(ctrl.task.title);
        expect(callArgs[0].project_id).toBe(project.id);
        expect(project.tasks.length).toBe(2);
        expect(project.tasks[0].title).toBe('t2');
        expect(scope.closeThisDialog).toHaveBeenCalled();
        expect(airyUserMock.reload).toHaveBeenCalled();
    });
});
