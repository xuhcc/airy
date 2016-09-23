class ProjectUpdateController {

    constructor($scope, hotkeys, projectResource, project) {
        this.scope = $scope;
        this.projectResource = projectResource;
        this.originalProject = project;

        this.project = angular.copy(this.originalProject);
        this.formTitle = 'Project #' + this.project.id;
        this.submitForm = this.updateProject;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateProject() {
        this.projectResource.update(this.project).success((data) => {
            angular.extend(this.originalProject, data.project);
            this.scope.closeThisDialog();
        });
    }
}

export default ProjectUpdateController;
