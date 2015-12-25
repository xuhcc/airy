function ProjectDetailController($stateParams, $rootScope, $interval, ngDialog, hotkeys,
                                 airyPopup, airyUser, projectResource, taskResource, timeEntryResource) {
    const self = this;
    self.client = {};
    self.project = {};
    self.currentStatus = 'open';
    self.filterByStatus = filterByStatus;
    self.createTask = createTask;
    self.updateTask = updateTask;
    self.deleteTask = deleteTask;
    self.toggleStatus = toggleStatus;
    self.toggleTimer = toggleTimer;
    self.createTimeEntry = createTimeEntry;
    self.updateTimeEntry = updateTimeEntry;
    self.deleteTimeEntry = deleteTimeEntry;

    fetchProject();

    hotkeys.add({
        combo: 'alt+a',
        callback: function (event) {
            event.preventDefault();
            createTask();
        },
    });

    function fetchProject() {
        projectResource.get($stateParams.projectId, self.currentStatus)
            .success(function (data) {
                $rootScope.title = data.project.name;
                self.project = data.project;
                self.client = data.project.client;
            });
    }

    function filterByStatus(status) {
        self.currentStatus = status;
        fetchProject();
    }

    function createTask() {
        ngDialog.open({
            template: 'static/partials/task_form.html',
            controller: 'TaskCreationController',
            className: 'popup task-form-popup',
            resolve: {
                project: function () {
                    return self.project;
                },
            },
        });
    }

    function updateTask(task) {
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
    }

    function deleteTask(task) {
        airyPopup.confirm('Delete task?', function () {
            taskResource.delete(task).success(function (data) {
                fetchProject();
                airyUser.reload();
            });
        });
    }

    function toggleStatus(task) {
        taskResource.toggleStatus(task).success(function (data) {
            angular.extend(task, data.task);
            airyUser.reload();
        });
    }

    function toggleTimer(task) {
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
            createTimeEntry(task, task.timerData.duration);
            delete task.timerData;
        }
    }

    function createTimeEntry(task, duration) {
        ngDialog.open({
            template: 'static/partials/time_entry_form.html',
            controller: 'TimeEntryCreationController',
            resolve: {
                task: function () {
                    return task;
                },
                duration: function () {
                    return duration;
                },
            },
        });
    }

    function updateTimeEntry(task, timeEntry) {
        ngDialog.open({
            template: 'static/partials/time_entry_form.html',
            controller: 'TimeEntryUpdateController',
            resolve: {
                task: function () {
                    return task;
                },
                timeEntry: function () {
                    return timeEntry;
                },
            },
        });
    }

    function deleteTimeEntry(task, timeEntry) {
        airyPopup.confirm('Delete time entry?', function () {
            timeEntryResource.delete(timeEntry).success(function (data) {
                task.total_time = data.task_total_time;
                task.time_entries.splice(task.time_entries.indexOf(timeEntry), 1);
                airyUser.reload();
            });
        });
    }
}

export default ProjectDetailController;
