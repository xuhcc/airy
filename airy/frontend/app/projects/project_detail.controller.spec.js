describe('Project detail', function () {
    'use strict';

    var scope;
    var rootScope;
    var buildCtrl;
    var project;
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
    var timeEntryResourceMock = {};

    beforeEach(module('airy.projectDetail'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        project = {
            id: 3,
            name: 'test',
            client: {id: 1},
            tasks: [
                {id: 6},
                {id: 7},
            ],
        };
        buildCtrl = function () {
            return $controller('ProjectDetailController', {
                $scope: scope,
                $stateParams: {projectId: 1, currentStatus: 'open'},
                $rootScope: rootScope,
                $interval: function () {},
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
});
