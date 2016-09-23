import 'projects/project_form.module.js';

describe('Project update', function () {
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
    let projectResourceMock = {
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
        buildCtrl = () => $controller('ProjectUpdateController', {
            $scope: scope,
            hotkeys: hotkeysMock,
            projectResource: projectResourceMock,
            project: project,
        });
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        let ctrl = buildCtrl();
        expect(ctrl.project).toEqual(project);
        expect(ctrl.formTitle).toEqual('Project #10');
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should update project', function () {
        let ctrl = buildCtrl();
        ctrl.project.name = 'new';
        spyOn(projectResourceMock, 'update').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        ctrl.submitForm();
        expect(projectResourceMock.update).toHaveBeenCalled();
        let callArgs = projectResourceMock.update.calls.argsFor(0);
        expect(callArgs[0].id).toBe(ctrl.project.id);
        expect(callArgs[0].client_id).toBe(ctrl.project.client_id);
        expect(project.name).toBe('new');
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
