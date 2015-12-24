import 'tasks/task_form.module.js';

describe('Task creation', function () {
    'use strict';

    let scope;
    let ctrl;
    let project;
    let taskResourceMock = {
        create: function (task) {
            return {
                success: function (successCallback) {
                    successCallback({task: task});
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
        ctrl = $controller('TaskCreationController', {
            $scope: scope,
            airyUser: airyUserMock,
            taskResource: taskResourceMock,
            project: project,
        });
    }));

    it('should load controller', function () {
        expect(scope.task).toEqual({project_id: project.id});
        expect(scope.formTitle).toEqual('New task');
        expect(scope.submitForm).toBeDefined();
    });

    it('should create task', function () {
        scope.task.title = 't2';
        spyOn(taskResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        spyOn(airyUserMock, 'reload').and.callThrough();
        scope.submitForm();
        expect(taskResourceMock.create).toHaveBeenCalled();
        let callArgs = taskResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].title).toBe(scope.task.title);
        expect(callArgs[0].project_id).toBe(project.id);
        expect(project.tasks[1].title).toBe('t2');
        expect(project.tasks.length).toBe(2);
        expect(scope.closeThisDialog).toHaveBeenCalled();
        expect(airyUserMock.reload).toHaveBeenCalled();
    });
});
