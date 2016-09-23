class ProjectCreationController {

    constructor($scope, hotkeys, projectResource, client) {
        this._scope = $scope;
        this._projectResource = projectResource;
        this._client = client;

        this.project = {client_id: this._client.id};
        this.formTitle = 'New project';
        this.submitForm = this.createProject;

        hotkeys.bindTo(this._scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createProject() {
        this._projectResource.create(this.project).success((data) => {
            this._client.projects.push(data.project);
            this._scope.closeThisDialog();
        });
    }
}

export default ProjectCreationController;
