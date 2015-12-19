(function () {
    'use strict';

    angular
        .module('airy.resources', [])
        .factory('clientResource', clientResource)
        .factory('projectResource', projectResource)
        .factory('taskResource', taskResource)
        .factory('timeEntryResource', timeEntryResource);

    function clientResource($http) {
        var prepare = function (client) {
            return {
                name: client.name,
                contacts: client.contacts,
            };
        };
        return {
            list: function () {
                return $http.get('/clients');
            },
            create: function (client) {
                return $http.post('/clients', prepare(client));
            },
            get: function (client_id) {
                return $http.get('/clients/' + client_id);
            },
            update: function (client) {
                return $http.put('/clients/' + client.id, prepare(client));
            },
            delete: function (client) {
                return $http.delete('/clients/' + client.id);
            },
            getTimeSheet: function (client_id, range) {
                return $http.get(
                    '/clients/' + client_id + '/timesheet',
                    {params: range});
            },
            sendTimeSheet: function (client_id, range) {
                return $http.post(
                    '/clients/' + client_id + '/timesheet',
                    range);
            },
            getReport: function (client_id, range) {
                return $http.get(
                    '/clients/' + client_id + '/report',
                    {params: range});
            },
            sendReport: function (client_id, range) {
                return $http.post(
                    '/clients/' + client_id + '/report',
                    range);
            },
        };
    }

    function projectResource($http) {
        var prepare = function (project) {
            return {
                name: project.name,
                description: project.description,
                client_id: project.client_id,
            };
        };
        return {
            create: function (project, status) {
                return $http.post('/projects', prepare(project));
            },
            get: function (project_id, status) {
                return $http.get('/projects/' + project_id, {params: {status: status}});
            },
            update: function (project) {
                return $http.put('/projects/' + project.id, prepare(project));
            },
            delete: function (project) {
                return $http.delete('/projects/' + project.id);
            },
        };
    }

    function taskResource($http) {
        var prepare = function (task) {
            return {
                title: task.title,
                description: task.description,
                project_id: task.project_id,
            };
        };
        return {
            create: function (task) {
                return $http.post('/tasks', prepare(task));
            },
            update: function (task) {
                return $http.put('/tasks/' + task.id, prepare(task));
            },
            delete: function (task) {
                return $http.delete('/tasks/' + task.id);
            },
            toggleStatus: function (task) {
                return $http.post('/tasks/' + task.id + '/status');
            },
        };
    }

    function timeEntryResource($http) {
        var prepare = function (timeEntry) {
            return {
                duration: timeEntry.duration,
                comment: timeEntry.comment,
                task_id: timeEntry.task_id,
            };
        };
        return {
            create: function (timeEntry) {
                return $http.post('/time_entries', prepare(timeEntry));
            },
            update: function (timeEntry) {
                return $http.put('/time_entries/' + timeEntry.id, prepare(timeEntry));
            },
            delete: function (timeEntry) {
                return $http.delete('/time_entries/' + timeEntry.id);
            },
        };
    }
})();
