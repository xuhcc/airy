import 'clients/client_detail.module.js';

describe('Client detail', function () {
    'use strict';

    let scope;
    let rootScope;
    let buildCtrl;
    let client;
    let ngDialogMock = {
        open: (config) => {},
    };
    let hotkeysMock = {
        add: (config) => {},
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
        scope = $rootScope.$new();
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
            return $controller('ClientDetailController', {
                $scope: scope,
                $stateParams: {clientId: 1},
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
        spyOn(clientResourceMock, 'get').and.callThrough();
        buildCtrl();
        expect(clientResourceMock.get).toHaveBeenCalled();
        expect(rootScope.title).toEqual(client.name);
        expect(scope.client).toEqual(client);
    });

    it('should create project', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        scope.createProject();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should update project', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        scope.updateProject();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should delete project', function () {
        buildCtrl();
        spyOn(clientResourceMock, 'get').and.callThrough();
        spyOn(projectResourceMock, 'delete').and.callThrough();
        let project = client.projects[1];
        scope.deleteProject(project);
        expect(projectResourceMock.delete).toHaveBeenCalled();
        let callArgs = projectResourceMock.delete.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(project.id);
        expect(clientResourceMock.get).toHaveBeenCalled();
    });
});
