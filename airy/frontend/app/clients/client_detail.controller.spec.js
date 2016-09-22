import 'clients/client_detail.module.js';

describe('Client detail', function () {
    'use strict';

    let rootScope;
    let buildCtrl;
    let client;
    let ngDialogMock = {
        open: (config) => {},
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
    let clientResourceMock = {
        get: function () {
            return {
                success: function (successCallback) {
                    successCallback({client: client});
                },
            };
        },
    };
    let projectResourceMock = {
        delete: function () {
            return {
                success: function (successCallback) {
                    successCallback();
                },
            };
        },
    };

    beforeEach(module('airy.clientDetail'));
    beforeEach(inject(function ($controller, $rootScope) {
        let scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        client = {
            id: 1,
            name: 'test',
            projects: [
                {id: 1},
                {id: 2},
            ],
        };
        buildCtrl = function () {
            return $controller('ClientDetailController as ctrl', {
                $stateParams: {clientId: 1},
                $scope: scope,
                $rootScope: rootScope,
                ngDialog: ngDialogMock,
                hotkeys: hotkeysMock,
                airyPopup: airyPopupMock,
                clientResource: clientResourceMock,
                projectResource: projectResourceMock,
            });
        };
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        spyOn(clientResourceMock, 'get').and.callThrough();
        let ctrl = buildCtrl();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
        expect(clientResourceMock.get).toHaveBeenCalled();
        expect(rootScope.title).toEqual(client.name);
        expect(ctrl.client).toEqual(client);
    });

    it('should create project', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        ctrl.createProject();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should update project', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        ctrl.updateProject();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should delete project', function () {
        let ctrl = buildCtrl();
        spyOn(clientResourceMock, 'get').and.callThrough();
        spyOn(projectResourceMock, 'delete').and.callThrough();
        let project = client.projects[1];
        ctrl.deleteProject(project);
        expect(projectResourceMock.delete).toHaveBeenCalled();
        let callArgs = projectResourceMock.delete.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(project.id);
        expect(clientResourceMock.get).toHaveBeenCalled();
    });
});
