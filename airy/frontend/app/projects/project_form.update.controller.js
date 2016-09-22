function ProjectUpdateController($scope, hotkeys, projectResource, project) {
    $scope.project = angular.copy(project);
    $scope.formTitle = 'Project #' + $scope.project.id;
    $scope.submitForm = updateProject;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function updateProject() {
        projectResource.update($scope.project).success(function (data) {
            angular.extend(project, data.project);
            $scope.closeThisDialog();
        });
    }
}

export default ProjectUpdateController;
