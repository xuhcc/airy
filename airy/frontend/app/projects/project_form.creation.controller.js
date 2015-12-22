function ProjectCreationController($scope, projectResource, client) {
    $scope.project = {client_id: client.id};
    $scope.formTitle = 'New project';
    $scope.submitForm = createProject;

    function createProject() {
        projectResource.create($scope.project).success(function (data) {
            client.projects.push(data.project);
            $scope.closeThisDialog();
        });
    }
}

export default ProjectCreationController;
