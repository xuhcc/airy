describe('Project update', function () {
    'use strict';

    var scope;
    var ctrl;
    var project;
    var projectResourceMock = {
        update: function (project) {
            return {
                success: function (successCallback) {
                    successCallback({project: project});
                },
            };
        },
    };

    beforeEach(module('airy.projectForm'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.closeThisDialog = function () {};
        project = {id: 10, client_id: 1, name: 'p10'};
        ctrl = $controller('ProjectUpdateController', {
            $scope: scope,
            projectResource: projectResourceMock,
            project: project,
        });
    }));

    it('should load controller', function () {
        expect(scope.project).toEqual(project);
        expect(scope.formTitle).toEqual('Project #10');
        expect(scope.submitForm).toBeDefined();
    });

    it('should update project', function () {
        scope.project.name = 'new';
        spyOn(projectResourceMock, 'update').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(projectResourceMock.update).toHaveBeenCalled();
        var callArgs = projectResourceMock.update.calls.argsFor(0);
        expect(callArgs[0].id).toBe(scope.project.id);
        expect(callArgs[0].client_id).toBe(scope.project.client_id);
        expect(project.name).toBe('new');
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
