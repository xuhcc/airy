class ClientListController {

    constructor($rootScope, ngDialog, hotkeys, airyPopup, clientResource) {
        const self = this;
        self.clients = [];
        self.createClient = createClient;
        self.updateClient = updateClient;
        self.deleteClient = deleteClient;

        fetchClients();

        $rootScope.title = 'Clients';

        hotkeys.add({
            combo: 'alt+a',
            callback: (event) => {
                event.preventDefault();
                createClient();
            },
        });

        function fetchClients() {
            clientResource.list().success((data) => {
                self.clients = data.clients;
            });
        }

        function createClient() {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientCreationController',
                resolve: {
                    clients: () => self.clients,
                },
            });
        }

        function updateClient(client) {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientUpdateController',
                resolve: {
                    client: () => client,
                },
            });
        }

        function deleteClient(client) {
            airyPopup.confirm('Delete client?', () => {
                clientResource.delete(client).success((data) => {
                    self.clients.splice(self.clients.indexOf(client), 1);
                });
            });
        }
    }
}

export default ClientListController;
