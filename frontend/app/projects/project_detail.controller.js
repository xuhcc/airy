class ProjectDetailController {

    constructor($stateParams, $scope, $rootScope, $interval, ngDialog, hotkeys,
                airyPopup, airyUser, airyBreadcrumbs,
                projectResource, taskResource, timeEntryResource) {
        this._stateParams = $stateParams;
        this._rootScope = $rootScope;
        this._interval = $interval;
        this._ngDialog = ngDialog;
        this._airyPopup = airyPopup;
        this._airyUser = airyUser;
        this._breadcrumbs = airyBreadcrumbs;
        this._projectResource = projectResource;
        this._taskResource = taskResource;
        this._timeEntryResource = timeEntryResource;

        this.client = {};
        this.project = {};
        this.currentStatus = 'open';

        this.fetchProject();

        hotkeys.bindTo($scope).add({
            combo: 'alt+a',
            callback: (event) => {
                event.preventDefault();
                this.createTask();
            },
        });
    }

    fetchProject() {
        this._projectResource
            .retrieve(this._stateParams.projectId, this.currentStatus)
            .then(response => {
                let data = response.data;
                this._rootScope.title = data.project.name;
                this._breadcrumbs.add({
                    label: data.project.client.name,
                    state: 'client_detail',
                    params: {clientId: data.project.client.id},
                }, {label: data.project.name});
                this.project = data.project;
                this.client = data.project.client;
            });
    }

    filterByStatus(status) {
        this.currentStatus = status;
        this.fetchProject();
    }

    createTask() {
        this._ngDialog.open({
            template: 'static/partials/task_form.html',
            controller: 'TaskCreationController',
            controllerAs: 'ctrl',
            className: 'popup task-form-popup',
            resolve: {
                project: () => this.project,
            },
        });
    }

    updateTask(task) {
        this._ngDialog.open({
            template: 'static/partials/task_form.html',
            controller: 'TaskUpdateController',
            controllerAs: 'ctrl',
            className: 'popup task-form-popup',
            resolve: {
                task: () => task,
            },
        });
    }

    deleteTask(task) {
        this._airyPopup.confirm('Delete task?', () => {
            this._taskResource.remove(task).then(response => {
                this.fetchProject();
                this._airyUser.reload();
            });
        });
    }

    toggleStatus(task) {
        this._taskResource.toggleStatus(task).then(response => {
            let data = response.data;
            angular.extend(task, data.task);
            this._airyUser.reload();
        });
    }

    toggleTimer(task) {
        if (!task.timerData) {
            // Start timer
            task.timerData = {
                start: moment(),
                timer: this._interval(() => {
                    task.timerData.duration = moment().diff(
                        moment(task.timerData.start), 'seconds', true);
                }, 500),
            };
        } else {
            // Stop timer
            this._interval.cancel(task.timerData.timer);
            this.createTimeEntry(task, task.timerData.duration);
            delete task.timerData;
        }
    }

    createTimeEntry(task, duration) {
        this._ngDialog.open({
            template: 'static/partials/time_entry_form.html',
            controller: 'TimeEntryCreationController',
            controllerAs: 'ctrl',
            resolve: {
                task: () => task,
                duration: () => duration,
            },
        });
    }

    updateTimeEntry(task, timeEntry) {
        this._ngDialog.open({
            template: 'static/partials/time_entry_form.html',
            controller: 'TimeEntryUpdateController',
            controllerAs: 'ctrl',
            resolve: {
                task: () => task,
                timeEntry: () => timeEntry,
            },
        });
    }

    deleteTimeEntry(task, timeEntry) {
        this._airyPopup.confirm('Delete time entry?', () => {
            this._timeEntryResource.remove(timeEntry).then(response => {
                let data = response.data;
                task.total_time = data.task_total_time;
                task.time_entries.splice(task.time_entries.indexOf(timeEntry), 1);
                this._airyUser.reload();
            });
        });
    }
}

export default ProjectDetailController;
