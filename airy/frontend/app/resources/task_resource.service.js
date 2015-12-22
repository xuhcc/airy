function taskResource($http) {
    var service = {
        create: createTask,
        update: updateTask,
        delete: deleteTask,
        toggleStatus: toggleTaskStatus,
    };
    return service;

    function prepare(task) {
        return {
            title: task.title,
            description: task.description,
            project_id: task.project_id,
        };
    }

    function createTask(task) {
        return $http.post('/tasks', prepare(task));
    }

    function updateTask(task) {
        return $http.put('/tasks/' + task.id, prepare(task));
    }

    function deleteTask(task) {
        return $http.delete('/tasks/' + task.id);
    }

    function toggleTaskStatus(task) {
        return $http.post('/tasks/' + task.id + '/status');
    }
}

export default taskResource;
