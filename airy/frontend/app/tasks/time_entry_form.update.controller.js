class TimeEntryUpdateController {

    constructor($scope, hotkeys, timeEntryResource, airyUser, TimeEntryDuration, task, timeEntry) {
        this.scope = $scope;
        this.timeEntryResource = timeEntryResource;
        this.airyUser = airyUser;
        this.task = task;
        this.originalTimeEntry = timeEntry;

        this.timeEntry = angular.copy(this.originalTimeEntry);
        this.duration = new TimeEntryDuration(this.timeEntry.duration);
        this.formTitle = 'Time entry #' + this.timeEntry.id;
        this.submitForm = this.updateTimeEntry;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    updateTimeEntry() {
        this.timeEntry.duration = this.duration.toSeconds();
        this.timeEntryResource.update(this.timeEntry).success((data) => {
            this.task.timeEntriesVisible = true;
            this.task.total_time = data.time_entry.task_total_time;
            angular.extend(this.originalTimeEntry, data.time_entry);
            this.airyUser.reload();
            this.scope.closeThisDialog();
        });
    }
}

export default TimeEntryUpdateController;
