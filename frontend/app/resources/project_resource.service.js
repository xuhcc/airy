export class projectResource {

    constructor($http) {
        this._http = $http;
    }

    _prepare(project) {
        return {
            name: project.name,
            description: project.description,
            client_id: project.client_id,
        };
    }

    create(project, status) {
        return this._http.post('/projects', this._prepare(project));
    }

    retrieve(projectId, status) {
        return this._http.get(`/projects/${projectId}`, {params: {status: status}});
    }

    update(project) {
        return this._http.put(`/projects/${project.id}`, this._prepare(project));
    }

    remove(project) {
        return this._http.delete(`/projects/${project.id}`);
    }
}
