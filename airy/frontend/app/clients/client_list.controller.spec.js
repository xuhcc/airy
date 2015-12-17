describe('Client list', function () {
    'use strict';

    var scope;
    var rootScope;
    var buildCtrl;
    var clients;
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
        list: function () {
            return {
                success: function (successCallback) {
                    successCallback({clients: clients});
                },
            };
        },
        delete: function (client) {
            return {
                success: function (successCallback) {
                    successCallback();
                },
            };
        },
    };

    beforeEach(module('airy.clientList'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        clients = [
            {id: 1},
            {id: 2},
        ];
        buildCtrl = function () {
            return $controller('ClientListController as ctrl', {
                $scope: scope,
                $rootScope: rootScope,
                ngDialog: ngDialogMock,
                hotkeys: hotkeysMock,
                airyPopup: airyPopupMock,
                clientResource: clientResourceMock,
            });
        };
    }));

    it('should load controller', function () {
        spyOn(clientResourceMock, 'list').and.callThrough();
        buildCtrl();
        expect(clientResourceMock.list).toHaveBeenCalled();
        expect(rootScope.title).toEqual('Clients');
        expect(scope.ctrl.clients).toEqual(clients);
    });

    it('should create client', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        scope.ctrl.createClient();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should update client', function () {
        buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        scope.ctrl.updateClient();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should delete client', function () {
        buildCtrl();
        expect(clients.length).toBe(2);
        spyOn(clientResourceMock, 'delete').and.callThrough();
        scope.ctrl.deleteClient(clients[1]);
        expect(clientResourceMock.delete).toHaveBeenCalled();
        var callArgs = clientResourceMock.delete.calls.argsFor(0);
        expect(clients.length).toBe(1);
    });
});
