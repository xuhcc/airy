class ClientListController {

    constructor($scope, $rootScope, ngDialog, hotkeys, airyPopup, clientResource) {
        this._ngDialog = ngDialog;
        this._airyPopup = airyPopup;
        this._clientResource = clientResource;

        this.clients = [];

        this.listClients();

        $rootScope.title = 'Clients';

        hotkeys.bindTo($scope).add({
            combo: 'alt+a',
            callback: (event) => {
                event.preventDefault();
                this.createClient();
            },
        });
    }

    listClients() {
        this._clientResource.list().then(response => {
            let data = response.data;
            this.clients = data.clients;
        });
    }

    createClient() {
        this._ngDialog.open({
            template: 'static/partials/client_form.html',
            controller: 'ClientCreationController',
            controllerAs: 'ctrl',
            resolve: {
                clients: () => this.clients,
            },
        });
    }

    updateClient(client) {
        this._ngDialog.open({
            template: 'static/partials/client_form.html',
            controller: 'ClientUpdateController',
            controllerAs: 'ctrl',
            resolve: {
                client: () => client,
            },
        });
    }

    deleteClient(client) {
        this._airyPopup.confirm('Delete client?', () => {
            this._clientResource.remove(client).then(response => {
                this.clients.splice(this.clients.indexOf(client), 1);
            });
        });
    }
}

export default ClientListController;
