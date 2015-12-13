(function () {
    'use strict';

    angular
        .module('airy.clientForm')
        .controller('ClientFormController', ClientFormController);

    function ClientFormController($scope, clientResource) {
        $scope.client = angular.copy($scope.ngDialogData.client);

        $scope.submitForm = function () {
            if (!$scope.client.id) {
                $scope.createClient($scope.client);
            } else {
                $scope.updateClient($scope.client);
            }
        };

        $scope.createClient = function (client) {
            clientResource.create(client).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.clients.push(data.client);
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateClient = function (client) {
            clientResource.update(client).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    angular.extend($scope.ngDialogData.client, data.client);
                    $scope.closeThisDialog();
                }
            });
        };
    }
})();
