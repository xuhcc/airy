function ClientCreationController($scope, hotkeys, clientResource, clients) {
    $scope.client = {};
    $scope.formTitle = 'New client';
    $scope.submitForm = createClient;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function createClient() {
        clientResource.create($scope.client).success(function (data) {
            clients.push(data.client);
            $scope.closeThisDialog();
        });
    }
}

export default ClientCreationController;
