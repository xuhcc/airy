import 'clients/client_form.module.js';

describe('Client creation', function () {
    'use strict';

    var scope;
    var ctrl;
    var clients;
    var clientResourceMock = {
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
        ctrl = $controller('ClientCreationController', {
            $scope: scope,
            clientResource: clientResourceMock,
            clients: clients,
        });
    }));

    it('should load controller', function () {
        expect(scope.client).toEqual({});
        expect(scope.formTitle).toEqual('New client');
        expect(scope.submitForm).toBeDefined();
    });

    it('should create client', function () {
        scope.client = {name: 'test'};
        spyOn(clientResourceMock, 'create').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(clientResourceMock.create).toHaveBeenCalled();
        var callArgs = clientResourceMock.create.calls.argsFor(0);
        expect(callArgs[0].name).toBe(scope.client.name);
        expect(clients[1].name).toBe(scope.client.name);
        expect(clients.length).toBe(2);
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
