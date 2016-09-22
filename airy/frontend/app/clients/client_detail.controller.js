function ClientDetailController($stateParams, $scope, $rootScope, ngDialog,
                                hotkeys, airyPopup, clientResource, projectResource) {
    const self = this;
    self.client = {};
    self.createProject = createProject;
    self.updateProject = updateProject;
    self.deleteProject = deleteProject;

    fetchClient();

    hotkeys.bindTo($scope).add({
        combo: 'alt+a',
        callback: function (event) {
            event.preventDefault();
            createProject();
        },
    });

    function fetchClient() {
        clientResource.get($stateParams.clientId).success(function (data) {
            $rootScope.title = data.client.name;
            self.client = data.client;
        });
    }

    function createProject() {
        ngDialog.open({
            template: 'static/partials/project_form.html',
            controller: 'ProjectCreationController',
            resolve: {
                client: function () {
                    return self.client;
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
