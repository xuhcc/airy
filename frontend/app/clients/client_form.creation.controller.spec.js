import './client_form.module.js';

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
                then: function (successCallback) {
                    successCallback({
                        data: {client: client},
                    });
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
        let ctrl = buildCtrl();
        expect(ctrl.client).toEqual({});
        expect(ctrl.formTitle).toEqual('New client');
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should create client', function () {
        let ctrl = buildCtrl();
        ctrl.client = {name: 'test'};
        spyOn(clientResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        ctrl.submitForm();
        expect(clientResourceMock.create).toHaveBeenCalled();
        let callArgs = clientResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].name).toBe(ctrl.client.name);
        expect(clients.length).toBe(2);
        expect(clients[0].name).toBe(ctrl.client.name);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
