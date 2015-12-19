(function () {
    'use strict';

    angular
        .module('airy.clientList')
        .controller('ClientListController', ClientListController);

    function ClientListController($rootScope, ngDialog, hotkeys, airyPopup, clientResource) {
        var self = this;
        self.clients = [];
        self.createClient = createClient;
        self.updateClient = updateClient;
        self.deleteClient = deleteClient;

        fetchClients();

        $rootScope.title = 'Clients';

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                createClient();
            },
        });

        function fetchClients() {
            clientResource.list().success(function (data) {
                self.clients = data.clients;
            });
        }

        function createClient() {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientCreationController',
                resolve: {
                    clients: function () {
                        return self.clients;
                    },
                },
            });
        }

        function updateClient(client) {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientUpdateController',
                resolve: {
                    client: function () {
                        return client;
                    },
                },
            });
        }

        function deleteClient(client) {
            airyPopup.confirm('Delete client?', function () {
                clientResource.delete(client).success(function (data) {
                    self.clients.splice(self.clients.indexOf(client), 1);
                });
            });
        }
    }
})();
