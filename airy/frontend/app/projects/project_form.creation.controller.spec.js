import 'projects/project_form.module.js';

describe('Project creation', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let client;

    let hotkeysMock = {
        bindTo: () => {
            return {
                add: () => {},
            };
        },
    };
    let projectResourceMock = {
        create: function (project) {
            return {
                then: function (successCallback) {
                    successCallback({
                        data: {project: project},
                    });
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
        buildCtrl = () => $controller('ProjectCreationController', {
            $scope: scope,
            hotkeys: hotkeysMock,
            projectResource: projectResourceMock,
            client: client,
        });
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        let ctrl = buildCtrl();
        expect(ctrl.project).toEqual({client_id: client.id});
        expect(ctrl.formTitle).toEqual('New project');
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should create project', function () {
        let ctrl = buildCtrl();
        ctrl.project.name = 'p2';
        spyOn(projectResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        ctrl.submitForm();
        expect(projectResourceMock.create).toHaveBeenCalled();
        let callArgs = projectResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].name).toBe(ctrl.project.name);
        expect(callArgs[0].client_id).toBe(client.id);
        expect(client.projects[1].name).toBe('p2');
        expect(client.projects.length).toBe(2);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
