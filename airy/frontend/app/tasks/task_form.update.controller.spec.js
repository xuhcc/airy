describe('Task update', function () {
    'use strict';

    var scope;
    var ctrl;
    var task;
    var taskResourceMock = {
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
        ctrl = $controller('TaskUpdateController', {
            $scope: scope,
            taskResource: taskResourceMock,
            task: task,
        });
    }));

    it('should load controller', function () {
        expect(scope.task).toEqual(task);
        expect(scope.formTitle).toEqual('Task #5');
        expect(scope.submitForm).toBeDefined();
    });

    it('should update task', function () {
        scope.task.title = 'new';
        spyOn(taskResourceMock, 'update').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(taskResourceMock.update).toHaveBeenCalled();
        var callArgs = taskResourceMock.update.calls.argsFor(0);
        expect(callArgs[0].id).toBe(scope.task.id);
        expect(callArgs[0].project_id).toBe(scope.task.project_id);
        expect(task.title).toBe('new');
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
