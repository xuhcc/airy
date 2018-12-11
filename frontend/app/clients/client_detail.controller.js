class ClientDetailController {

    constructor(
        $stateParams, $scope, $rootScope, ngDialog,
        hotkeys, airyPopup, airyBreadcrumbs,
        clientResource, projectResource
    ) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._ngDialog = ngDialog;
        this._airyPopup = airyPopup;
        this._breadcrumbs = airyBreadcrumbs;
        this._clientResource = clientResource;
        this._projectResource = projectResource;

        this.client = {};

        this.retrieveClient();

        hotkeys.bindTo($scope).add({
            combo: 'alt+a',
            callback: (event) => {
                event.preventDefault();
                this.createProject();
            },
        });
    }

    retrieveClient() {
        this._clientResource.retrieve(this._stateParams.clientId).then(response => {
            let data = response.data;
            this._rootScope.title = data.client.name;
            this._breadcrumbs.add({label: data.client.name});
            this.client = data.client;
        });
    }

    createProject() {
        this._ngDialog.open({
            template: 'partials/project_form.html',
            controller: 'ProjectCreationController',
            controllerAs: 'ctrl',
            resolve: {
                client: () => this.client,
            },
        });
    }

    updateProject(project) {
        this._ngDialog.open({
            template: 'partials/project_form.html',
            controller: 'ProjectUpdateController',
            controllerAs: 'ctrl',
            resolve: {
                project: () => project,
            },
        });
    }

    deleteProject(project) {
        this._airyPopup.confirm('Delete project?', () => {
            this._projectResource.remove(project).then(response => {
                this.retrieveClient();
            });
        });
    }
}

export default ClientDetailController;
