(function () {
    'use strict';

    angular
        .module('airy.timeEntryForm')
        .controller('TimeEntryUpdateController', TimeEntryUpdateController);

    function TimeEntryUpdateController($scope, timeEntryResource, airyUser, TimeEntryDuration, task, timeEntry) {
        $scope.timeEntry = angular.copy(timeEntry);
        $scope.duration = new TimeEntryDuration($scope.timeEntry.duration);
        $scope.formTitle = 'Time entry #' + $scope.timeEntry.id;
        $scope.submitForm = updateTimeEntry;

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
})();
