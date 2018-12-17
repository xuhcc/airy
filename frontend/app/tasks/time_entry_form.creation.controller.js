export class TimeEntryCreationController {

    constructor($scope, hotkeys, timeEntryResource, airyUser, TimeEntryDuration, task, duration) {
        this._scope = $scope;
        this._timeEntryResource = timeEntryResource;
        this._airyUser = airyUser;
        this._task = task;

        this.timeEntry = {task_id: this._task.id};
        this.duration = new TimeEntryDuration(duration || 0);
        this.formTitle = 'New time entry';
        this.submitForm = this.createTimeEntry;

        hotkeys.bindTo(this._scope).add({
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
        this._timeEntryResource.create(this.timeEntry).then(response => {
            let data = response.data;
            this._task.timeEntriesVisible = true;
            this._task.total_time = data.time_entry.task_total_time;
            this._task.time_entries.push(data.time_entry);
            this._airyUser.reload();
            this._scope.closeThisDialog();
        });
    }
}
