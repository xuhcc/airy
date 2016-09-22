function TaskCreationController($scope, hotkeys, airyUser, taskResource, project) {
    $scope.task = {project_id: project.id};
    $scope.formTitle = 'New task';
    $scope.submitForm = createTask;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function createTask() {
        taskResource.create($scope.task).success(function (data) {
            project.tasks.push(data.task);
            airyUser.reload();
            $scope.closeThisDialog();
        });
    }
}

export default TaskCreationController;
