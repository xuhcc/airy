class ProjectUpdateController {

    constructor($scope, hotkeys, projectResource, project) {
        this._scope = $scope;
        this._projectResource = projectResource;
        this._originalProject = project;

        this.project = angular.copy(this._originalProject);
        this.formTitle = 'Project #' + this.project.id;
        this.submitForm = this.updateProject;

        hotkeys.bindTo(this._scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateProject() {
        this._projectResource.update(this.project).then(response => {
            let data = response.data;
            angular.extend(this._originalProject, data.project);
            this._scope.closeThisDialog();
        });
    }
}

export default ProjectUpdateController;
