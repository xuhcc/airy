(function () {
    'use strict';

    angular
        .module('airy.clientList')
        .controller('ClientListController', ClientListController);

    function ClientListController($rootScope, ngDialog, hotkeys, airyPopup, clientResource) {
        var self = this;
        self.clients = [];

        self.fetchClients = function () {
            clientResource.list().success(function (data) {
                self.clients = data.clients;
            });
        };
        self.fetchClients();

        self.createClient = function () {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientCreationController',
                resolve: {
                    clients: function () {
                        return self.clients;
                    },
                },
            });
        };

        self.updateClient = function (client) {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientUpdateController',
                resolve: {
                    client: function () {
                        return client;
                    },
                },
            });
        };

        self.deleteClient = function (client) {
            airyPopup.confirm('Delete client?', function () {
                clientResource.delete(client).success(function (data) {
                    self.clients.splice(self.clients.indexOf(client), 1);
                });
            });
        };

        $rootScope.title = 'Clients';

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                self.createClient();
            },
        });
    }
})();
