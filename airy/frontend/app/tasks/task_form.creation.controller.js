class TaskCreationController {

    constructor($scope, hotkeys, airyUser, taskResource, project) {
        this.scope = $scope;
        this.airyUser = airyUser;
        this.taskResource = taskResource;
        this.project = project;

        this.task = {project_id: this.project.id};
        this.formTitle = 'New task';
        this.submitForm = this.createTask;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createTask() {
        this.taskResource.create(this.task).success((data) => {
            this.project.tasks.push(data.task);
            this.airyUser.reload();
            this.scope.closeThisDialog();
        });
    }
}

export default TaskCreationController;
