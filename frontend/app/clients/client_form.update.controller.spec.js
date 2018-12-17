import './client_form.module.js';

describe('Client update', function () {
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
    let clientResourceMock = {
        update: function (client) {
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
        client = {id: 1, name: 'test'};
        buildCtrl = () => $controller('ClientUpdateController', {
            $scope: scope,
            hotkeys: hotkeysMock,
            clientResource: clientResourceMock,
            client: client,
        });
    }));

    it('should load controller', function () {
        spyOn(hotkeysMock, 'bindTo').and.callThrough();
        let ctrl = buildCtrl();
        expect(ctrl.client).toEqual(client);
        expect(ctrl.formTitle).toEqual('Client #1');
        expect(ctrl.submitForm).toBeDefined();
        expect(hotkeysMock.bindTo).toHaveBeenCalled();
    });

    it('should update client', function () {
        let ctrl = buildCtrl();
        ctrl.client.name = 'new';
        spyOn(clientResourceMock, 'update').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        ctrl.submitForm();
        expect(clientResourceMock.update).toHaveBeenCalled();
        let callArgs = clientResourceMock.update.calls.argsFor(0);
        expect(callArgs[0].id).toBe(ctrl.client.id);
        expect(client.name).toBe('new');
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
