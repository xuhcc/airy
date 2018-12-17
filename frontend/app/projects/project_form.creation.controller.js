export class ProjectCreationController {

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
        this._projectResource.create(this.project).then(response => {
            let data = response.data;
            this._client.projects.unshift(data.project);
            this._scope.closeThisDialog();
        });
    }
}
