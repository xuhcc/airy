(function () {
    'use strict';

    angular
        .module('airy.timeEntryForm')
        .controller('TimeEntryCreationController', TimeEntryCreationController);

    function TimeEntryCreationController($scope, timeEntryResource, airyUser, TimeEntryDuration, task, duration) {
        $scope.timeEntry = {task_id: task.id};
        $scope.duration = new TimeEntryDuration(duration || 0);
        $scope.formTitle = 'New time entry';

        $scope.submitForm = function () {
            $scope.timeEntry.duration = $scope.duration.toSeconds();
            timeEntryResource.create($scope.timeEntry).success(function (data) {
                task.timeEntriesVisible = true;
                task.total_time = data.time_entry.task_total_time;
                task.time_entries.push(data.time_entry);
                airyUser.reload();
                $scope.closeThisDialog();
            });
        };
    }
})();
