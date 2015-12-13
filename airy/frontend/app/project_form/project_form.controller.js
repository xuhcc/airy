(function () {
    'use strict';

    angular
        .module('airy.projectForm')
        .controller('ProjectFormController', ProjectFormController);

    function ProjectFormController($scope, projectResource) {
        $scope.project = angular.copy($scope.ngDialogData.project);

        $scope.submitForm = function () {
            $scope.project.client_id = $scope.$parent.client.id;
            if (!$scope.project.id) {
                $scope.createProject($scope.project);
            } else {
                $scope.updateProject($scope.project);
            }
        };

        $scope.createProject = function (project) {
            projectResource.create(project).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.client.projects.push(data.project);
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateProject = function (project) {
            projectResource.update(project).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    angular.extend($scope.ngDialogData.project, data.project);
                    $scope.closeThisDialog();
                }
            });
        };
    }
})();
