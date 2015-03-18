(function () {
    'use strict';

    angular
        .module('airyControllers', [])
        .controller('LoginController', LoginController)
        .controller('ClientListController', ClientListController)
        .controller('ClientFormController', ClientFormController)
        .controller('ClientDetailController', ClientDetailController)
        .controller('ProjectFormController', ProjectFormController)
        .controller('ProjectDetailController', ProjectDetailController)
        .controller('TaskFormController', TaskFormController)
        .controller('TimeEntryFormController', TimeEntryFormController)
        .controller('ProjectReportController', ProjectReportController)
        .controller('ReportListController', ReportListController);

    function LoginController($scope, $rootScope, airyUser) {
        $rootScope.title = 'Login';

        $scope.loginUser = function () {
            airyUser.login($scope.password);
        };
    }

    function ClientListController($scope, $rootScope, ngDialog, hotkeys, airyModal, clientResource) {
        $rootScope.title = 'Clients';
        $scope.clients = [];
        $scope.currentClient = {};

        $scope.fetchClients = function () {
            clientResource.list().success(function (data) {
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
                clientResource.delete(client).success(function (data) {
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
    }

    function ClientFormController($scope, clientResource) {
        $scope.submitForm = function () {
            if (!$scope.$parent.currentClient.id) {
                $scope.createClient($scope.$parent.currentClient);
            } else {
                $scope.updateClient($scope.$parent.currentClient);
            }
        };

        $scope.createClient = function (client) {
            clientResource.create(client).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.clients.push(data.client);
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateClient = function (client) {
            clientResource.update(client).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    angular.extend(client, data.client);
                    $scope.closeThisDialog();
                }
            });
        };
    }

    function ClientDetailController($scope, $routeParams, $rootScope, ngDialog, hotkeys, airyModal, clientResource, projectResource) {
        $scope.client = {};
        $scope.currentProject = {};

        $scope.fetchClient = function () {
            clientResource.get($routeParams.clientId).success(function (data) {
                $rootScope.title = data.client.name;
                $scope.client = data.client;
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
                projectResource.delete(project).success(function (data) {
                    $scope.fetchClient();
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
    }

    function ProjectFormController($scope, projectResource) {
        $scope.submitForm = function () {
            if (!$scope.$parent.currentProject.id) {
                $scope.createProject($scope.$parent.currentProject);
            } else {
                $scope.updateProject($scope.$parent.currentProject);
            }
        };

        $scope.createProject = function (project) {
            projectResource.create(project).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.client.projects.push(data.project);
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateProject = function (project) {
            projectResource.update(project).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    angular.extend(project, data.project);
                    $scope.closeThisDialog();
                }
            });
        };
    }

    function ProjectDetailController($scope, $routeParams, $rootScope, $interval, ngDialog, hotkeys, airyModal, airyUser, projectResource, taskResource, timeEntryResource) {
        $scope.project = {};
        $scope.currentStatus = 'active';
        $scope.currentTask = {};
        $scope.currentTimeEntry = {};

        $scope.fetchProject = function () {
            projectResource.get($routeParams.projectId, $scope.currentStatus)
                .success(function (data) {
                    $rootScope.title = data.project.name;
                    $scope.project = data.project;
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
                taskResource.delete(task).success(function (data) {
                    $scope.fetchProject();
                    airyUser.reload();
                });
            });
        };

        $scope.setTaskStatus = function (task, status) {
            taskResource.setStatus(task, status).success(function (data) {
                task.status = data.status;
                airyUser.reload();
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
                $scope.showTaskForm({});
            }
        });

        $scope.fetchProject();
    }

    function TaskFormController($scope, airyUser, taskResource) {
        $scope.submitForm = function () {
            if (!$scope.$parent.currentTask.id) {
                $scope.createTask($scope.$parent.currentTask);
            } else {
                $scope.updateTask($scope.$parent.currentTask);
            }
        };

        $scope.createTask = function (task) {
            taskResource.create(task).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.project.tasks.push(data.task);
                    airyUser.reload();
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.updateTask = function (task) {
            taskResource.update(task).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    angular.extend(task, data.task);
                    $scope.closeThisDialog();
                }
            });
        };
    }

    function TimeEntryFormController($scope, timeEntryResource, airyUser) {
        $scope.submitForm = function () {
            if (!$scope.$parent.currentTimeEntry.id) {
                $scope.createTimeEntry($scope.$parent.currentTimeEntry);
            } else {
                $scope.updateTimeEntry($scope.$parent.currentTimeEntry);
            }
        };

        $scope.createTimeEntry = function (timeEntry) {
            timeEntryResource.create(timeEntry).success(function (data) {
                if (data.error_msg) {
                    $scope.errorMessage = data.error_msg;
                } else {
                    $scope.$parent.currentTask.timeEntriesVisible = true;
                    $scope.$parent.currentTask.total_time = data.time_entry.task_total_time;
                    $scope.$parent.currentTask.time_entries.push(data.time_entry);
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
                    $scope.$parent.currentTask.timeEntriesVisible = true;
                    $scope.$parent.currentTask.total_time = data.time_entry.task_total_time;
                    angular.extend(timeEntry, data.time_entry);
                    airyUser.reload();
                    $scope.closeThisDialog();
                }
            });
        };

        $scope.incrementTimeAmount = function (timeEntry) {
            var newValue = parseFloat(timeEntry.amount || 0) + 0.5;
            timeEntry.amount = newValue.toFixed(2);
        };
    }

    function ProjectReportController($scope, $routeParams, $rootScope, $location, airyModal, reportResource) {
        $scope.report = {};

        $scope.fetchReport = function () {
            reportResource.get($routeParams.projectId).success(function (data) {
                $rootScope.title = data.report.project.name + ' :: Report';
                $scope.report = data.report;
            });
        };

        $scope.saveReport = function () {
            airyModal.confirm('Close tasks and save report?', function () {
                reportResource.save($routeParams.projectId).success(function (data) {
                    $location.path('/reports');
                });
            });
        };

        $scope.fetchReport();
    }

    function ReportListController($scope, $rootScope, reportResource) {
        $rootScope.title = 'Reports';
        $scope.reports = [];
        $scope.fetchReports = function () {
            reportResource.list().success(function (data) {
                $scope.reports = data.reports;
            });
        };
        $scope.fetchReports();
    }
})();
