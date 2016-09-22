function TimeEntryUpdateController($scope, hotkeys, timeEntryResource, airyUser, TimeEntryDuration, task, timeEntry) {
    $scope.timeEntry = angular.copy(timeEntry);
    $scope.duration = new TimeEntryDuration($scope.timeEntry.duration);
    $scope.formTitle = 'Time entry #' + $scope.timeEntry.id;
    $scope.submitForm = updateTimeEntry;

    hotkeys.bindTo($scope).add({
        combo: 'ctrl+enter',
        callback: (event) => {
            event.preventDefault();
            $scope.submitForm();
        },
        allowIn: ['input', 'textarea'],
    });

    function updateTimeEntry() {
        $scope.timeEntry.duration = $scope.duration.toSeconds();
        timeEntryResource.update($scope.timeEntry).success(function (data) {
            task.timeEntriesVisible = true;
            task.total_time = data.time_entry.task_total_time;
            angular.extend(timeEntry, data.time_entry);
            airyUser.reload();
            $scope.closeThisDialog();
        });
    }
}

export default TimeEntryUpdateController;
