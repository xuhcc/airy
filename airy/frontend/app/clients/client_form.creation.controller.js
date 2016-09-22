class ClientCreationController {

    constructor($scope, hotkeys, clientResource, clients) {
        this.scope = $scope;
        this.clientResource = clientResource;
        this.clients = clients;

        this.client = {};
        this.formTitle = 'New client';
        this.submitForm = this.createClient;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createClient() {
        this.clientResource.create(this.client).success((data) => {
            this.clients.push(data.client);
            this.scope.closeThisDialog();
        });
    }
}

export default ClientCreationController;
