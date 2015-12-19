(function () {
    'use strict';

    angular
        .module('airy.resources')
        .factory('projectResource', projectResource);

    function projectResource($http) {
        var service = {
            create: createProject,
            get: getProject,
            update: updateProject,
            delete: deleteProject,
        };
        return service;

        function prepare(project) {
            return {
                name: project.name,
                description: project.description,
                client_id: project.client_id,
            };
        }

        function createProject(project, status) {
            return $http.post('/projects', prepare(project));
        }

        function getProject(project_id, status) {
            return $http.get('/projects/' + project_id, {params: {status: status}});
        }

        function updateProject(project) {
            return $http.put('/projects/' + project.id, prepare(project));
        }

        function deleteProject(project) {
            return $http.delete('/projects/' + project.id);
        }
    }
})();
