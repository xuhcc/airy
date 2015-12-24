function clientResource($http) {
    let service = {
        list: listClients,
        create: createClient,
        get: getClient,
        update: updateClient,
        delete: deleteClient,
        getTimeSheet: getTimeSheet,
        sendTimeSheet: sendTimeSheet,
        getReport: getReport,
        sendReport: sendReport,
    };
    return service;

    function prepare(client) {
        return {
            name: client.name,
            contacts: client.contacts,
        };
    }

    function listClients() {
        return $http.get('/clients');
    }

    function createClient(client) {
        return $http.post('/clients', prepare(client));
    }

    function getClient(client_id) {
        return $http.get('/clients/' + client_id);
    }

    function updateClient(client) {
        return $http.put('/clients/' + client.id, prepare(client));
    }

    function deleteClient(client) {
        return $http.delete('/clients/' + client.id);
    }

    function getTimeSheet(client_id, range) {
        return $http.get(
            '/clients/' + client_id + '/timesheet',
            {params: range});
    }

    function sendTimeSheet(client_id, range) {
        return $http.post(
            '/clients/' + client_id + '/timesheet',
            range);
    }

    function getReport(client_id, range) {
        return $http.get(
            '/clients/' + client_id + '/report',
            {params: range});
    }

    function sendReport(client_id, range) {
        return $http.post(
            '/clients/' + client_id + '/report',
            range);
    }
}

export default clientResource;
