(function () {
    'use strict';

    angular
        .module('airy.projectForm')
        .controller('ProjectUpdateController', ProjectUpdateController);

    function ProjectUpdateController($scope, projectResource, project) {
        $scope.project = angular.copy(project);
        $scope.formTitle = 'Project #' + $scope.project.id;
        $scope.submitForm = updateProject;

        function updateProject() {
            projectResource.update($scope.project).success(function (data) {
                angular.extend(project, data.project);
                $scope.closeThisDialog();
            });
        }
    }
})();
