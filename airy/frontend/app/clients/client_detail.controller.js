function ClientDetailController($scope, $stateParams, $rootScope, ngDialog,
                                hotkeys, airyPopup, clientResource, projectResource) {
    $scope.client = {};
    $scope.createProject = createProject;
    $scope.updateProject = updateProject;
    $scope.deleteProject = deleteProject;

    fetchClient();

    hotkeys.add({
        combo: 'alt+a',
        callback: function (event) {
            event.preventDefault();
            createProject();
        },
    });

    function fetchClient() {
        clientResource.get($stateParams.clientId).success(function (data) {
            $rootScope.title = data.client.name;
            $scope.client = data.client;
        });
    }

    function createProject() {
        ngDialog.open({
            template: 'static/partials/project_form.html',
            controller: 'ProjectCreationController',
            resolve: {
                client: function () {
                    return $scope.client;
                },
            },
        });
    }

    function updateProject(project) {
        ngDialog.open({
            template: 'static/partials/project_form.html',
            controller: 'ProjectUpdateController',
            resolve: {
                project: function () {
                    return project;
                },
            },
        });
    }

    function deleteProject(project) {
        airyPopup.confirm('Delete project?', function () {
            projectResource.delete(project).success(function (data) {
                fetchClient();
            });
        });
    }
}

export default ClientDetailController;
