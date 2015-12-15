describe('Client update', function () {
    'use strict';

    var scope;
    var ctrl;
    var client;
    var clientResourceMock = {
        update: function (client) {
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
        client = {id: 1, name: 'test'};
        ctrl = $controller('ClientUpdateController', {
            $scope: scope,
            clientResource: clientResourceMock,
            client: client,
        });
    }));

    it('should load controller', function () {
        expect(scope.client).toEqual(client);
        expect(scope.formTitle).toEqual('Client #1');
        expect(scope.submitForm).toBeDefined();
    });

    it('should update client', function () {
        scope.client.name = 'new';
        spyOn(clientResourceMock, 'update').and.callThrough();
        spyOn(scope, 'closeThisDialog').and.callThrough();
        scope.submitForm();
        expect(clientResourceMock.update).toHaveBeenCalled();
        var callArgs = clientResourceMock.update.calls.argsFor(0);
        expect(callArgs[0].id).toBe(scope.client.id);
        expect(client.name).toBe('new');
        expect(scope.closeThisDialog).toHaveBeenCalled();
    });
});
