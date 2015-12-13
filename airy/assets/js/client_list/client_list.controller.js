(function () {
    'use strict';

    angular
        .module('airy.clientList')
        .controller('ClientListController', ClientListController);

    function ClientListController($scope, $rootScope, ngDialog, hotkeys, airyModal, clientResource) {
        $rootScope.title = 'Clients';
        $scope.clients = [];

        $scope.fetchClients = function () {
            clientResource.list().success(function (data) {
                $scope.clients = data.clients;
            });
        };
        $scope.fetchClients();

        $scope.showClientForm = function (client) {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientFormController',
                scope: $scope,
                data: {client: client},
            });
        };

        $scope.deleteClient = function (client) {
            airyModal.confirm('Delete client?', function () {
                clientResource.delete(client).success(function (data) {
                    $scope.clients.splice($scope.clients.indexOf(client), 1);
                });
            });
        };

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                $scope.showClientForm({});
            },
        });
    }
})();
