class TaskUpdateController {

    constructor($scope, hotkeys, taskResource, task) {
        this.scope = $scope;
        this.taskResource = taskResource;
        this.originalTask = task;

        this.task = angular.copy(this.originalTask);
        this.formTitle = 'Task #' + this.task.id;
        this.submitForm = this.updateTask;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateTask() {
        this.taskResource.update(this.task).success((data) => {
            angular.extend(this.originalTask, data.task);
            this.scope.closeThisDialog();
        });
    }
}

export default TaskUpdateController;
