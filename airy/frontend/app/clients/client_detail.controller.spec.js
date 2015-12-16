describe('Client detail', function () {
    'use strict';

    var scope;
    var rootScope;
    var buildCtrl;
    var client;
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
    var clientResourceMock = {
        get: function () {
            return {
                success: function (successCallback) {
                    successCallback({client: client});
                },
            };
        },
    };
    var projectResourceMock = {
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
        var project = client.projects[1];
        scope.deleteProject(project);
        expect(projectResourceMock.delete).toHaveBeenCalled();
        var callArgs = projectResourceMock.delete.calls.argsFor(0);
        expect(callArgs[0].id).toEqual(project.id);
        expect(clientResourceMock.get).toHaveBeenCalled();
    });
});
