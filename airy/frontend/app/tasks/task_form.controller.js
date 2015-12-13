(function () {
    'use strict';

    angular
        .module('airy.taskForm')
        .controller('TaskFormController', TaskFormController);

    function TaskFormController($scope, airyUser, taskResource) {
        $scope.task = angular.copy($scope.ngDialogData.task);

        $scope.submitForm = function () {
            $scope.task.project_id = $scope.$parent.project.id;
            if (!$scope.task.id) {
                $scope.createTask($scope.task);
            } else {
                $scope.updateTask($scope.task);
            }
        };

        $scope.createTask = function (task) {
            taskResource.create(task).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.project.tasks.push(data.task);
                    airyUser.reload();
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateTask = function (task) {
            taskResource.update(task).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    angular.extend($scope.ngDialogData.task, data.task);
                    $scope.closeThisDialog();
                }
            });
        };
    }
})();
