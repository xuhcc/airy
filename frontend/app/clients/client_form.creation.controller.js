class ClientCreationController {

    constructor($scope, hotkeys, clientResource, clients) {
        this._scope = $scope;
        this._clientResource = clientResource;
        this._clients = clients;

        this.client = {};
        this.formTitle = 'New client';
        this.submitForm = this.createClient;

        hotkeys.bindTo(this._scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createClient() {
        this._clientResource.create(this.client).then(response => {
            let data = response.data;
            this._clients.unshift(data.client);
            this._scope.closeThisDialog();
        });
    }
}

export default ClientCreationController;
