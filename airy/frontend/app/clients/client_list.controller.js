(function () {
    'use strict';

    angular
        .module('airy.clientList')
        .controller('ClientListController', ClientListController);

    function ClientListController($scope, $rootScope, ngDialog, hotkeys, airyPopup, clientResource) {
        $rootScope.title = 'Clients';
        $scope.clients = [];

        $scope.fetchClients = function () {
            clientResource.list().success(function (data) {
                $scope.clients = data.clients;
            });
        };
        $scope.fetchClients();

        $scope.createClient = function () {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientCreationController',
                resolve: {
                    clients: function () {
                        return $scope.clients;
                    },
                },
            });
        };

        $scope.updateClient = function (client) {
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

        $scope.deleteClient = function (client) {
            airyPopup.confirm('Delete client?', function () {
                clientResource.delete(client).success(function (data) {
                    $scope.clients.splice($scope.clients.indexOf(client), 1);
                });
            });
        };

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                $scope.createClient();
            },
        });
    }
})();
