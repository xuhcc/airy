function ClientUpdateController($scope, hotkeys, clientResource, client) {
    $scope.client = angular.copy(client);
    $scope.formTitle = 'Client #' + client.id;
    $scope.submitForm = updateClient;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function updateClient() {
        clientResource.update($scope.client).success(function (data) {
            angular.extend(client, data.client);
            $scope.closeThisDialog();
        });
    }
}

export default ClientUpdateController;
