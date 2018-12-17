export class ClientUpdateController {

    constructor($scope, hotkeys, clientResource, client) {
        this._scope = $scope;
        this._clientResource = clientResource;
        this._originalClient = client;

        this.client = angular.copy(this._originalClient);
        this.formTitle = 'Client #' + this.client.id;
        this.submitForm = this.updateClient;

        hotkeys.bindTo(this._scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateClient() {
        this._clientResource.update(this.client).then(response => {
            let data = response.data;
            angular.extend(this._originalClient, data.client);
            this._scope.closeThisDialog();
        });
    }
}
