(function () {
    'use strict';

    angular
        .module('airy.taskForm')
        .controller('TaskCreationController', TaskCreationController);

    function TaskCreationController($scope, airyUser, taskResource, project) {
        $scope.task = {project_id: project.id};
        $scope.formTitle = 'New task';
        $scope.submitForm = createTask;

        function createTask() {
            taskResource.create($scope.task).success(function (data) {
                project.tasks.push(data.task);
                airyUser.reload();
                $scope.closeThisDialog();
            });
        }
    }
})();
