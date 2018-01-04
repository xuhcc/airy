class TimeEntryUpdateController {

    constructor($scope, hotkeys, timeEntryResource, airyUser, TimeEntryDuration, task, timeEntry) {
        this._scope = $scope;
        this._timeEntryResource = timeEntryResource;
        this._airyUser = airyUser;
        this._task = task;
        this._originalTimeEntry = timeEntry;

        this.timeEntry = angular.copy(this._originalTimeEntry);
        this.duration = new TimeEntryDuration(this.timeEntry.duration);
        this.formTitle = 'Time entry #' + this.timeEntry.id;
        this.submitForm = this.updateTimeEntry;

        hotkeys.bindTo(this._scope).add({
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
        this._timeEntryResource.update(this.timeEntry).then(response => {
            let data = response.data;
            this._task.timeEntriesVisible = true;
            this._task.total_time = data.time_entry.task_total_time;
            angular.extend(this._originalTimeEntry, data.time_entry);
            this._airyUser.reload();
            this._scope.closeThisDialog();
        });
    }
}

export default TimeEntryUpdateController;
