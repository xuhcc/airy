class taskResource {

    constructor($http) {
        this._http = $http;
    }

    _prepare(task) {
        return {
            title: task.title,
            url: task.url,
            description: task.description,
            project_id: task.project_id,
        };
    }

    create(task) {
        return this._http.post('/tasks', this._prepare(task));
    }

    update(task) {
        return this._http.put(`/tasks/${task.id}`, this._prepare(task));
    }

    remove(task) {
        return this._http.delete(`/tasks/${task.id}`);
    }

    toggleStatus(task) {
        return this._http.post(`/tasks/${task.id}/status`);
    }
}

export default taskResource;
