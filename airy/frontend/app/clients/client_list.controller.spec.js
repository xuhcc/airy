import 'clients/client_list.module.js';

describe('Client list', function () {
    'use strict';

    let rootScope;
    let ctrl;
    let buildCtrl;
    let clients;
    let ngDialogMock = {
        open: function (config) {},
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
    beforeEach(inject(function ($componentController, $rootScope) {
        let scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        clients = [
            {id: 1},
            {id: 2},
        ];
        buildCtrl = function () {
            return $componentController('clientList', {
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
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        spyOn(clientResourceMock, 'list').and.callThrough();
        let ctrl = buildCtrl();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
        expect(clientResourceMock.list).toHaveBeenCalled();
        expect(rootScope.title).toEqual('Clients');
        expect(ctrl.clients).toEqual(clients);
    });

    it('should create client', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        ctrl.createClient();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should update client', function () {
        let ctrl = buildCtrl();
        spyOn(ngDialogMock, 'open').and.callThrough();
        ctrl.updateClient();
        expect(ngDialogMock.open).toHaveBeenCalled();
    });

    it('should delete client', function () {
        let ctrl = buildCtrl();
        expect(clients.length).toBe(2);
        spyOn(clientResourceMock, 'delete').and.callThrough();
        ctrl.deleteClient(clients[1]);
        expect(clientResourceMock.delete).toHaveBeenCalled();
        let callArgs = clientResourceMock.delete.calls.argsFor(0);
        expect(clients.length).toBe(1);
    });
});
