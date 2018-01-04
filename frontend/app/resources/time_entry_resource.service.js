class timeEntryResource {

    constructor($http) {
        this._http = $http;
    }

    _prepare(timeEntry) {
        return {
            duration: timeEntry.duration,
            comment: timeEntry.comment,
            task_id: timeEntry.task_id,
        };
    }

    create(timeEntry) {
        return this._http.post('/time_entries', this._prepare(timeEntry));
    }

    update(timeEntry) {
        return this._http.put(`/time_entries/${timeEntry.id}`, this._prepare(timeEntry));
    }

    remove(timeEntry) {
        return this._http.delete(`/time_entries/${timeEntry.id}`);
    }
}

export default timeEntryResource;
