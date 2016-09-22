function ProjectCreationController($scope, hotkeys, projectResource, client) {
    $scope.project = {client_id: client.id};
    $scope.formTitle = 'New project';
    $scope.submitForm = createProject;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function createProject() {
        projectResource.create($scope.project).success(function (data) {
            client.projects.push(data.project);
            $scope.closeThisDialog();
        });
    }
}

export default ProjectCreationController;
