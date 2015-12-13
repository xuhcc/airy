(function () {
    'use strict';

    angular
        .module('airy.timeEntryForm')
        .controller('TimeEntryFormController', TimeEntryFormController);

    function TimeEntryFormController($scope, timeEntryResource, airyUser) {
        $scope.timeEntry = angular.copy($scope.ngDialogData.timeEntry);
        if ($scope.ngDialogData.duration) {
            $scope.timeEntry.duration = $scope.ngDialogData.duration;
        }
        if ($scope.timeEntry.duration) {
            $scope.time = getTime();
        }

        function getTime() {
            var duration = moment.duration(
                $scope.timeEntry.duration, 'seconds');
            return {
                hours: duration.hours(),
                minutes: duration.minutes(),
            };
        }

        function getDuration() {
            var duration = moment.duration($scope.time);
            return duration.asSeconds();
        }

        $scope.submitForm = function () {
            $scope.timeEntry.task_id = $scope.ngDialogData.task.id;
            $scope.timeEntry.duration = getDuration();
            if (!$scope.timeEntry.id) {
                $scope.createTimeEntry($scope.timeEntry);
            } else {
                $scope.updateTimeEntry($scope.timeEntry);
            }
        };

        $scope.createTimeEntry = function (timeEntry) {
            timeEntryResource.create(timeEntry).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.ngDialogData.task.timeEntriesVisible = true;
                    $scope.ngDialogData.task.total_time = data.time_entry.task_total_time;
                    $scope.ngDialogData.task.time_entries.push(data.time_entry);
                    airyUser.reload();
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateTimeEntry = function (timeEntry) {
            timeEntryResource.update(timeEntry).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.ngDialogData.task.timeEntriesVisible = true;
                    $scope.ngDialogData.task.total_time = data.time_entry.task_total_time;
                    angular.extend($scope.ngDialogData.timeEntry, data.time_entry);
                    airyUser.reload();
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.incrementDuration = function () {
            var duration = moment.duration($scope.time).add(30, 'minutes');
            $scope.time = {
                hours: duration.hours(),
                minutes: duration.minutes(),
            };
        };
    }
})();
