class ClientUpdateController {

    constructor($scope, hotkeys, clientResource, client) {
        this.scope = $scope;
        this.clientResource = clientResource;
        this.originalClient = client;

        this.client = angular.copy(this.originalClient);
        this.formTitle = 'Client #' + this.client.id;
        this.submitForm = this.updateClient;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateClient() {
        this.clientResource.update(this.client).success((data) => {
            angular.extend(this.originalClient, data.client);
            this.scope.closeThisDialog();
        });
    }
}

export default ClientUpdateController;
