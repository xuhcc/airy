export class clientResource {

    constructor($http) {
        this._http = $http;
    }

    _prepare(client) {
        return {
            name: client.name,
            contacts: client.contacts,
        };
    }

    list() {
        return this._http.get('/clients');
    }

    create(client) {
        return this._http.post('/clients', this._prepare(client));
    }

    retrieve(clientId) {
        return this._http.get(`/clients/${clientId}`);
    }

    update(client) {
        return this._http.put(`/clients/${client.id}`, this._prepare(client));
    }

    remove(client) {
        return this._http.delete(`/clients/${client.id}`);
    }

    getTimeSheet(clientId, range) {
        return this._http.get(
            `/clients/${clientId}/timesheet`,
            {params: range});
    }

    sendTimeSheet(clientId, range) {
        return this._http.post(
            `/clients/${clientId}/timesheet`,
            range);
    }

    getReport(clientId, range) {
        return this._http.get(
            `/clients/${clientId}/report`,
            {params: range});
    }

    sendReport(clientId, range) {
        return this._http.post(
            `/clients/${clientId}/report`,
            range);
    }
}
