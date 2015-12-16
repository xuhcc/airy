(function () {
    'use strict';

    angular
        .module('airy.taskForm')
        .controller('TaskUpdateController', TaskUpdateController);

    function TaskUpdateController($scope, taskResource, task) {
        $scope.task = angular.copy(task);
        $scope.formTitle = 'Task #' + $scope.task.id;

        $scope.submitForm = function () {
            taskResource.update($scope.task).success(function (data) {
                angular.extend(task, data.task);
                $scope.closeThisDialog();
            });
        };
    }
})();
