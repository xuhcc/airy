import 'clients/client_form.module.js';

describe('Client creation', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let clients;

    let hotkeysMock = {
        bindTo: () => {
            return {
                add: () => {},
            };
        },
    };
    let clientResourceMock = {
        create: function (client) {
            return {
                success: function (successCallback) {
                    successCallback({client: client});
                },
            };
        },
    };

    beforeEach(module('airy.clientForm'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.closeThisDialog = function () {};
        clients = [
            {id: 1},
        ];
        buildCtrl = () => $controller('ClientCreationController', {
            $scope: scope,
            hotkeys: hotkeysMock,
            clientResource: clientResourceMock,
            clients: clients,
        });
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        buildCtrl();
        expect(scope.client).toEqual({});
        expect(scope.formTitle).toEqual('New client');
        expect(scope.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should create client', function () {
        buildCtrl();
        scope.client = {name: 'test'};
        spyOn(clientResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(clientResourceMock.create).toHaveBeenCalled();
        let callArgs = clientResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].name).toBe(scope.client.name);
        expect(clients[1].name).toBe(scope.client.name);
        expect(clients.length).toBe(2);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
