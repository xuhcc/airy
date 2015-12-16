describe('Project creation', function () {
    'use strict';

    var scope;
    var ctrl;
    var client;
    var projectResourceMock = {
        create: function (project) {
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
        client = {
            id: 1,
            projects: [
                {name: 'p1'},
            ],
        };
        ctrl = $controller('ProjectCreationController', {
            $scope: scope,
            projectResource: projectResourceMock,
            client: client,
        });
    }));

    it('should load controller', function () {
        expect(scope.project).toEqual({client_id: client.id});
        expect(scope.formTitle).toEqual('New project');
        expect(scope.submitForm).toBeDefined();
    });

    it('should create project', function () {
        scope.project.name = 'p2';
        spyOn(projectResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(projectResourceMock.create).toHaveBeenCalled();
        var callArgs = projectResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].name).toBe(scope.project.name);
        expect(callArgs[0].client_id).toBe(client.id);
        expect(client.projects[1].name).toBe('p2');
        expect(client.projects.length).toBe(2);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
