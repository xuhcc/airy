class TaskUpdateController {

    constructor($scope, hotkeys, taskResource, task) {
        this._scope = $scope;
        this._taskResource = taskResource;
        this._originalTask = task;

        this.task = angular.copy(this._originalTask);
        this.formTitle = 'Task #' + this.task.id;
        this.submitForm = this.updateTask;

        hotkeys.bindTo(this._scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateTask() {
        this._taskResource.update(this.task).then(response => {
            let data = response.data;
            angular.extend(this._originalTask, data.task);
            this._scope.closeThisDialog();
        });
    }
}

export default TaskUpdateController;
