(function () {
    'use strict';

    angular
        .module('airy.timeEntryForm')
        .controller('TimeEntryFormController', TimeEntryFormController);

    function TimeEntryFormController($scope, timeEntryResource, airyUser, TimeEntryDuration) {
        $scope.timeEntry = angular.copy($scope.ngDialogData.timeEntry);
        $scope.duration = new TimeEntryDuration(
            $scope.ngDialogData.duration || $scope.timeEntry.duration);

        $scope.submitForm = function () {
            $scope.timeEntry.task_id = $scope.ngDialogData.task.id;
            $scope.timeEntry.duration = $scope.duration.toSeconds();
            if (!$scope.timeEntry.id) {
                $scope.createTimeEntry($scope.timeEntry);
            } else {
                $scope.updateTimeEntry($scope.timeEntry);
            }
        };

        $scope.createTimeEntry = function (timeEntry) {
            timeEntryResource.create(timeEntry).success(function (data) {
                $scope.ngDialogData.task.timeEntriesVisible = true;
                $scope.ngDialogData.task.total_time = data.time_entry.task_total_time;
                $scope.ngDialogData.task.time_entries.push(data.time_entry);
                airyUser.reload();
                $scope.closeThisDialog();
            });
        };

        $scope.updateTimeEntry = function (timeEntry) {
            timeEntryResource.update(timeEntry).success(function (data) {
                $scope.ngDialogData.task.timeEntriesVisible = true;
                $scope.ngDialogData.task.total_time = data.time_entry.task_total_time;
                angular.extend($scope.ngDialogData.timeEntry, data.time_entry);
                airyUser.reload();
                $scope.closeThisDialog();
            });
        };
    }
})();
