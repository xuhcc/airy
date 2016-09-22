function TaskUpdateController($scope, hotkeys, taskResource, task) {
    $scope.task = angular.copy(task);
    $scope.formTitle = 'Task #' + $scope.task.id;
    $scope.submitForm = updateTask;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function updateTask() {
        taskResource.update($scope.task).success(function (data) {
            angular.extend(task, data.task);
            $scope.closeThisDialog();
        });
    }
}

export default TaskUpdateController;
