class TimeEntryCreationController {

    constructor($scope, hotkeys, timeEntryResource, airyUser, TimeEntryDuration, task, duration) {
        this.scope = $scope;
        this.timeEntryResource = timeEntryResource;
        this.airyUser = airyUser;
        this.task = task;

        this.timeEntry = {task_id: this.task.id};
        this.duration = new TimeEntryDuration(duration || 0);
        this.formTitle = 'New time entry';
        this.submitForm = this.createTimeEntry;

        hotkeys.bindTo(this.scope).add({
            combo: 'ctrl+enter',
            callback: (event) => {
                event.preventDefault();
                this.submitForm();
            },
            allowIn: ['input', 'textarea'],
        });
    }

    createTimeEntry() {
        this.timeEntry.duration = this.duration.toSeconds();
        this.timeEntryResource.create(this.timeEntry).success((data) => {
            this.task.timeEntriesVisible = true;
            this.task.total_time = data.time_entry.task_total_time;
            this.task.time_entries.push(data.time_entry);
            this.airyUser.reload();
            this.scope.closeThisDialog();
        });
    }
}

export default TimeEntryCreationController;
