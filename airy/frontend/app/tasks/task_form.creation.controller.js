class TaskCreationController {

    constructor($scope, hotkeys, airyUser, taskResource, project) {
        this._scope = $scope;
        this._airyUser = airyUser;
        this._taskResource = taskResource;
        this._project = project;

        this.task = {project_id: this._project.id};
        this.formTitle = 'New task';
        this.submitForm = this.createTask;

        hotkeys.bindTo(this._scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createTask() {
        this._taskResource.create(this.task).then(response => {
            let data = response.data;
            this._project.tasks.push(data.task);
            this._airyUser.reload();
            this._scope.closeThisDialog();
        });
    }
}

export default TaskCreationController;
