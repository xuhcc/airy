(function () {
    'use strict';

    angular
        .module('airy.projectDetail')
        .controller('ProjectDetailController', ProjectDetailController);

    function ProjectDetailController($scope, $stateParams, $rootScope, $interval, ngDialog, hotkeys,
                                     airyPopup, airyUser, projectResource, taskResource, timeEntryResource) {
        $scope.project = {};
        $scope.currentStatus = 'open';

        $scope.fetchProject = function () {
            projectResource.get($stateParams.projectId, $scope.currentStatus)
                .success(function (data) {
                    $rootScope.title = data.project.name;
                    $scope.project = data.project;
                    $scope.client = data.project.client;
                });
        };
        $scope.fetchProject();

        $scope.filterByStatus = function (status) {
            $scope.currentStatus = status;
            $scope.fetchProject();
        };

        $scope.createTask = function () {
            ngDialog.open({
                template: 'static/partials/task_form.html',
                controller: 'TaskCreationController',
                className: 'popup task-form-popup',
                resolve: {
                    project: function () {
                        return $scope.project;
                    },
                },
            });
        };

        $scope.updateTask = function (task) {
            ngDialog.open({
                template: 'static/partials/task_form.html',
                controller: 'TaskUpdateController',
                className: 'popup task-form-popup',
                resolve: {
                    task: function () {
                        return task;
                    },
                },
            });
        };

        $scope.deleteTask = function (task) {
            airyPopup.confirm('Delete task?', function () {
                taskResource.delete(task).success(function (data) {
                    $scope.fetchProject();
                    airyUser.reload();
                });
            });
        };

        $scope.toggleStatus = function (task) {
            taskResource.toggleStatus(task).success(function (data) {
                angular.extend(task, data.task);
                airyUser.reload();
            });
        };

        $scope.toggleTimer = function (task) {
            if (!task.timerData) {
                // Start timer
                task.timerData = {
                    start: moment(),
                    timer: $interval(function () {
                        task.timerData.duration = moment().diff(
                            moment(task.timerData.start), 'seconds', true);
                    }, 500),
                };
            } else {
                // Stop timer
                $interval.cancel(task.timerData.timer);
                $scope.showTimeEntryForm(task, {}, task.timerData.duration);
                delete task.timerData;
            }
        };

        $scope.showTimeEntryForm = function (task, timeEntry, duration) {
            ngDialog.open({
                template: 'static/partials/time_entry_form.html',
                controller: 'TimeEntryFormController',
                scope: $scope,
                data: {
                    task: task,
                    timeEntry: timeEntry,
                    duration: duration,
                },
            });
        };

        $scope.deleteTimeEntry = function (task, timeEntry) {
            airyPopup.confirm('Delete time entry?', function () {
                timeEntryResource.delete(timeEntry).success(function (data) {
                    task.total_time = data.task_total_time;
                    task.time_entries.splice(task.time_entries.indexOf(timeEntry), 1);
                    airyUser.reload();
                });
            });
        };

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                $scope.createTask();
            },
        });
    }
})();
