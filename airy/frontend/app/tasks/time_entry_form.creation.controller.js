function TimeEntryCreationController($scope, hotkeys, timeEntryResource, airyUser, TimeEntryDuration, task, duration) {
    $scope.timeEntry = {task_id: task.id};
    $scope.duration = new TimeEntryDuration(duration || 0);
    $scope.formTitle = 'New time entry';
    $scope.submitForm = createTimeEntry;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function createTimeEntry() {
        $scope.timeEntry.duration = $scope.duration.toSeconds();
        timeEntryResource.create($scope.timeEntry).success(function (data) {
            task.timeEntriesVisible = true;
            task.total_time = data.time_entry.task_total_time;
            task.time_entries.push(data.time_entry);
            airyUser.reload();
            $scope.closeThisDialog();
        });
    }
}

export default TimeEntryCreationController;
