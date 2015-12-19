(function () {
    'use strict';

    angular
        .module('airy.clientForm')
        .controller('ClientCreationController', ClientCreationController);

    function ClientCreationController($scope, clientResource, clients) {
        $scope.client = {};
        $scope.formTitle = 'New client';
        $scope.submitForm = createClient;

        function createClient() {
            clientResource.create($scope.client).success(function (data) {
                clients.push(data.client);
                $scope.closeThisDialog();
            });
        }
    }
})();
