class ProjectCreationController {

    constructor($scope, hotkeys, projectResource, client) {
        this.scope = $scope;
        this.projectResource = projectResource;
        this.client = client;

        this.project = {client_id: this.client.id};
        this.formTitle = 'New project';
        this.submitForm = this.createProject;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createProject() {
        this.projectResource.create(this.project).success((data) => {
            this.client.projects.push(data.project);
            this.scope.closeThisDialog();
        });
    }
}

export default ProjectCreationController;
