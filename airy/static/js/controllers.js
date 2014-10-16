var airyControllers = angular.module('airyControllers', []);

airyControllers.controller('ClientListController', function ($scope, $http, $rootScope, ngDialog, hotkeys, airyModal) {
    $rootScope.title = 'Clients';
    $scope.clients = [];
    $scope.currentClient = {};

    $scope.fetchClients = function () {
        $http({
            method: 'GET',
            url: 'clients'
        }).success(function (data) {
            $scope.clients = data.clients;
        });
    };

    $scope.showClientForm = function (client) {
        $scope.currentClient = client;
        ngDialog.open({
            template: 'static/partials/client_form.html',
            controller: 'ClientFormController',
            scope: $scope
        });
    };

    $scope.deleteClient = function (client) {
        airyModal.confirm('Delete client?', function () {
            $http({
                method: 'DELETE',
                url: 'clients/' + client.id
            }).success(function (data) {
                $scope.clients.splice($scope.clients.indexOf(client), 1);
            });
        });
    };

    hotkeys.add({
        combo: 'alt+a',
        callback: function (event) {
            event.preventDefault();
            $scope.showClientForm({});
        }
    });

    $scope.fetchClients();
});

airyControllers.controller('ClientFormController', function ($scope, $http) {
    $scope.submitForm = function () {
        if (!$scope.$parent.currentClient.id) {
            $scope.createClient($scope.$parent.currentClient);
        } else {
            $scope.updateClient($scope.$parent.currentClient);
        }
    };

    $scope.createClient = function (client) {
        $http({
            method: 'POST',
            url: 'clients',
            data: {
                name: client.name,
                contacts: client.contacts
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                $scope.$parent.clients.push(data.client);
                $scope.closeThisDialog();
            }
        });
    };

    $scope.updateClient = function (client) {
        $http({
            method: 'PUT',
            url: 'clients/' + client.id,
            data: {
                name: client.name,
                contacts: client.contacts
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                angular.extend(client, data.client);
                $scope.closeThisDialog();
            }
        });
    };
});

airyControllers.controller('ClientDetailController', function ($scope, $http, $routeParams, $rootScope, ngDialog, hotkeys, airyModal) {
    $scope.client = {};
    $scope.projects = [];
    $scope.currentProject = {};

    $scope.fetchClient = function () {
        $http({
            method: 'GET',
            url: 'clients/' + $routeParams.clientId
        }).success(function (data) {
            $rootScope.title = data.client.name;
            $scope.client = data.client;
            $scope.projects = data.projects;
        });
    };

    $scope.showProjectForm = function (project) {
        if (!project.id) {
            project.client_id = $scope.client.id;
        }
        $scope.currentProject = project;
        ngDialog.open({
            template: 'static/partials/project_form.html',
            controller: 'ProjectFormController',
            scope: $scope
        });
    };

    $scope.deleteProject = function (project) {
        airyModal.confirm('Delete project?', function () {
            $http({
                method: 'DELETE',
                url: 'projects/' + project.id
            }).success(function (data) {
                $scope.projects.splice($scope.projects.indexOf(project), 1);
            });
        });
    };

    hotkeys.add({
        combo: 'alt+a',
        callback: function (event) {
            event.preventDefault();
            $scope.showProjectForm({});
        }
    });

    $scope.fetchClient();
});

airyControllers.controller('ProjectFormController', function ($scope, $http) {
    $scope.submitForm = function () {
        if (!$scope.$parent.currentProject.id) {
            $scope.createProject($scope.$parent.currentProject);
        } else {
            $scope.updateProject($scope.$parent.currentProject);
        }
    };

    $scope.createProject = function (project) {
        $http({
            method: 'POST',
            url: 'projects',
            data: {
                name: project.name,
                description: project.description,
                client_id: project.client_id
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                $scope.$parent.projects.push(data.project);
                $scope.closeThisDialog();
            }
        });
    };

    $scope.updateProject = function (project) {
        $http({
            method: 'PUT',
            url: 'projects/' + project.id,
            data: {
                name: project.name,
                description: project.description,
                client_id: project.client_id
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                angular.extend(project, data.project);
                $scope.closeThisDialog();
            }
        });
    };
});

airyControllers.controller('ProjectDetailController', function ($scope, $http, $routeParams, $rootScope, $interval, ngDialog, hotkeys, airyModal, airyUser) {
    $scope.project = {};
    $scope.tasks = [];
    $scope.currentStatus = 'active';
    $scope.currentTask = {};
    $scope.currentTimeEntry = {};

    $scope.fetchProject = function () {
        $http({
            method: 'GET',
            url: 'projects/' + $routeParams.projectId,
            params: {status: $scope.currentStatus}
        }).success(function (data) {
            $rootScope.title = data.project.name;
            $scope.project = data.project;
            $scope.tasks = data.tasks;
        });
    };

    $scope.filterByStatus = function (status) {
        $scope.currentStatus = status;
        $scope.fetchProject();
    };

    $scope.showTaskForm = function (task) {
        if (!task.id) {
            task.project_id = $scope.project.id;
        }
        $scope.currentTask = task;
        ngDialog.open({
            template: 'static/partials/task_form.html',
            controller: 'TaskFormController',
            scope: $scope
        });
    };

    $scope.deleteTask = function (task) {
        airyModal.confirm('Delete task?', function () {
            $http({
                method: 'DELETE',
                url: 'tasks/' + task.id
            }).success(function (data) {
                $scope.tasks.splice($scope.tasks.indexOf(task), 1);
                airyUser.load();
            });
        });
    };

    $scope.setTaskStatus = function (task, status) {
        $http({
            method: 'POST',
            url: 'tasks/' + task.id + '/status',
            data: {status: status}
        }).success(function (data) {
            task.status = status;
            airyUser.load();
        });
    };

    $scope.toggleTimer = function (task) {
        if (!task.timerData) {
            // Start timer
            task.timerData = {
                start: moment(),
                timer: $interval(function () {
                    task.timerData.amount = moment().diff(
                        moment(task.timerData.start), 'hours', true);
                }, 1000)
            };
        } else {
            // Stop timer
            $interval.cancel(task.timerData.timer);
            $scope.showTimeEntryForm(task, {}, task.timerData.amount);
            delete task.timerData;
        }
    };

    $scope.showTimeEntryForm = function (task, timeEntry, amount) {
        if (!timeEntry.id) {
            timeEntry.task_id = task.id;
            if (amount) {
                timeEntry.amount = amount.toFixed(2);
            }
        }
        $scope.currentTask = task;
        $scope.currentTimeEntry = timeEntry;
        ngDialog.open({
            template: 'static/partials/time_entry_form.html',
            controller: 'TimeEntryFormController',
            scope: $scope
        });
    };

    $scope.deleteTimeEntry = function (task, timeEntry) {
        airyModal.confirm('Delete time entry?', function () {
            $http({
                method: 'DELETE',
                url: 'time_entries/' + timeEntry.id
            }).success(function (data) {
                angular.extend(task, data.task);
                task.time_entries.splice(task.time_entries.indexOf(timeEntry), 1);
                airyUser.load();
            });
        });
    };

    hotkeys.add({
        combo: 'alt+a',
        callback: function (event) {
            event.preventDefault();
            $scope.showTaskForm({});
        }
    });

    $scope.fetchProject();
});

airyControllers.controller('TaskFormController', function ($scope, $http, airyUser) {
    $scope.submitForm = function () {
        if (!$scope.$parent.currentTask.id) {
            $scope.createTask($scope.$parent.currentTask);
        } else {
            $scope.updateTask($scope.$parent.currentTask);
        }
    };

    $scope.createTask = function (task) {
        $http({
            method: 'POST',
            url: 'tasks',
            data: {
                title: task.title,
                description: task.description,
                project_id: task.project_id
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                $scope.$parent.tasks.push(data.task);
                airyUser.load();
                $scope.closeThisDialog();
            }
        });
    };

    $scope.updateTask = function (task) {
        $http({
            method: 'PUT',
            url: 'tasks/' + task.id,
            data: {
                title: task.title,
                description: task.description,
                project_id: task.project_id
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                angular.extend(task, data.task);
                $scope.closeThisDialog();
            }
        });
    };
});

airyControllers.controller('TimeEntryFormController', function ($scope, $http, airyUser) {
    $scope.submitForm = function () {
        if (!$scope.$parent.currentTimeEntry.id) {
            $scope.createTimeEntry($scope.$parent.currentTimeEntry);
        } else {
            $scope.updateTimeEntry($scope.$parent.currentTimeEntry);
        }
    };

    $scope.createTimeEntry = function (timeEntry) {
        $http({
            method: 'POST',
            url: 'time_entries',
            data: {
                amount: timeEntry.amount,
                comment: timeEntry.comment,
                task_id: timeEntry.task_id
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                $scope.$parent.currentTask.timeEntriesVisible = true;
                angular.extend($scope.$parent.currentTask, data.task);
                $scope.$parent.currentTask.time_entries.push(data.time_entry);
                airyUser.load();
                $scope.closeThisDialog();
            }
        });
    };

    $scope.updateTimeEntry = function (timeEntry) {
        $http({
            method: 'PUT',
            url: 'time_entries/' + timeEntry.id,
            data: {
                amount: timeEntry.amount,
                comment: timeEntry.comment,
                task_id: timeEntry.task_id
            }
        }).success(function (data) {
            if (data.error_msg) {
                $scope.errorMessage = data.error_msg;
            } else {
                $scope.$parent.currentTask.timeEntriesVisible = true;
                angular.extend($scope.$parent.currentTask, data.task);
                angular.extend(timeEntry, data.time_entry);
                airyUser.load();
                $scope.closeThisDialog();
            }
        });
    };

    $scope.incrementTimeAmount = function (timeEntry) {
        var newValue = parseFloat(timeEntry.amount || 0) + 0.5;
        timeEntry.amount = newValue.toFixed(2);
    };
});

airyControllers.controller('ProjectReportController', function ($scope, $http, $routeParams, $rootScope, $location, airyModal) {
    $scope.report = {};

    $scope.fetchReport = function () {
        $http({
            method: 'GET',
            url: 'projects/' + $routeParams.projectId + '/report'
        }).success(function (data) {
            $rootScope.title = data.report.project.name + ' :: Report';
            $scope.report = data.report;
        });
    };

    $scope.saveReport = function () {
        airyModal.confirm('Close tasks and save report?', function () {
            $http({
                method: 'POST',
                url: 'projects/' + $routeParams.projectId + '/report'
            }).success(function (data) {
                $location.path('/reports');
            });
        });
    };

    $scope.fetchReport();
});

airyControllers.controller('ReportListController', function ($scope, $http, $rootScope) {
    $rootScope.title = 'Reports';
    $scope.reports = [];
    $scope.fetchReports = function () {
        $http({
            method: 'GET',
            url: 'reports'
        }).success(function (data) {
            $scope.reports = data.reports;
        });
    };
    $scope.fetchReports();
});
