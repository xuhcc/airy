function TaskUpdateController($scope, taskResource, task) {
    $scope.task = angular.copy(task);
    $scope.formTitle = 'Task #' + $scope.task.id;
    $scope.submitForm = updateTask;

    function updateTask() {
        taskResource.update($scope.task).success(function (data) {
            angular.extend(task, data.task);
            $scope.closeThisDialog();
        });
    }
}

export default TaskUpdateController;
