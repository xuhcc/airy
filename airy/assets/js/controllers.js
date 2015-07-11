(function () {
    'use strict';

    angular
        .module('airyControllers', [])
        .controller('LoginController', LoginController)
        .controller('ClientListController', ClientListController)
        .controller('ClientTimeSheetCtrl', ClientTimeSheetCtrl)
        .controller('ClientFormController', ClientFormController)
        .controller('ClientDetailController', ClientDetailController)
        .controller('ProjectFormController', ProjectFormController)
        .controller('ProjectDetailController', ProjectDetailController)
        .controller('ClientReportController', ClientReportController)
        .controller('TaskFormController', TaskFormController)
        .controller('TimeEntryFormController', TimeEntryFormController);

    function LoginController($scope, $rootScope, airyUser) {
        $rootScope.title = 'Login';

        $scope.loginUser = function () {
            airyUser.login($scope.password);
        };
    }

    function ClientListController($scope, $rootScope, ngDialog, hotkeys, airyModal, clientResource) {
        $rootScope.title = 'Clients';
        $scope.clients = [];

        $scope.fetchClients = function () {
            clientResource.list().success(function (data) {
                $scope.clients = data.clients;
            });
        };
        $scope.fetchClients();

        $scope.showClientForm = function (client) {
            ngDialog.open({
                template: 'static/partials/client_form.html',
                controller: 'ClientFormController',
                scope: $scope,
                data: {client: client}
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
    }

    function ClientFormController($scope, clientResource) {
        $scope.client = angular.copy($scope.ngDialogData.client);

        $scope.submitForm = function () {
            if (!$scope.client.id) {
                $scope.createClient($scope.client);
            } else {
                $scope.updateClient($scope.client);
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
                    angular.extend($scope.ngDialogData.client, data.client);
                    $scope.closeThisDialog();
                }
            });
        };
    }

    function ClientTimeSheetCtrl($scope, $stateParams, $rootScope, clientResource, calculator) {
        $scope.timesheet = {};
        $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        $scope.getTimeSheet = function () {
            clientResource.getTimeSheet($stateParams.clientId, $scope.range).success(function (data) {
                $rootScope.title = data.timesheet.client.name + ' :: Timesheet';
                $scope.timesheet = data.timesheet;
                $scope.client = data.timesheet.client;
            });
        };
        $scope.$watch('range', $scope.getTimeSheet, true);
        $scope.range = {
            beg: moment().startOf('isoWeek').format(),
            end: moment().endOf('isoWeek').format()
        };

        $scope.showCalculator = function (amount) {
            calculator.show(amount);
        };

        $scope.sendByEmail = function () {
            clientResource.sendTimeSheet($stateParams.clientId, $scope.range);
        };
    }

    function ClientDetailController($scope, $stateParams, $rootScope, ngDialog,
                                    hotkeys, airyModal, clientResource, projectResource) {
        $scope.client = {};

        $scope.fetchClient = function () {
            clientResource.get($stateParams.clientId).success(function (data) {
                $rootScope.title = data.client.name;
                $scope.client = data.client;
            });
        };
        $scope.fetchClient();

        $scope.showProjectForm = function (project) {
            ngDialog.open({
                template: 'static/partials/project_form.html',
                controller: 'ProjectFormController',
                scope: $scope,
                data: {project: project}
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
    }

    function ProjectFormController($scope, projectResource) {
        $scope.project = angular.copy($scope.ngDialogData.project);

        $scope.submitForm = function () {
            $scope.project.client_id = $scope.$parent.client.id;
            if (!$scope.project.id) {
                $scope.createProject($scope.project);
            } else {
                $scope.updateProject($scope.project);
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
                    angular.extend($scope.ngDialogData.project, data.project);
                    $scope.closeThisDialog();
                }
            });
        };
    }

    function ProjectDetailController($scope, $stateParams, $rootScope, $interval, ngDialog, hotkeys,
                                     airyModal, airyUser, projectResource, taskResource, timeEntryResource) {
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

        $scope.showTaskForm = function (task) {
            ngDialog.open({
                template: 'static/partials/task_form.html',
                controller: 'TaskFormController',
                scope: $scope,
                data: {task: task},
                className: 'popup task-form-popup'
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
                    }, 500)
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
                    duration: duration
                }
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
    }

    function ClientReportController($scope, $stateParams, $rootScope, clientResource, calculator) {
        $scope.report = {};

        $scope.periods = [{
            label: '1 week',
            getRangeEnd: function (rangeBeg) {
                return moment(rangeBeg).endOf('isoWeek').format();
            }
        }, {
            label: '2 weeks',
            getRangeEnd: function (rangeBeg) {
                return moment(rangeBeg).add(1, 'week').endOf('isoWeek').format();
            }
        }];
        $scope.period = $scope.periods[0];

        $scope.getReport = function () {
            clientResource.getReport($stateParams.clientId, $scope.range).success(function (data) {
                $rootScope.title = data.report.client.name + ' :: Task report';
                $scope.report = data.report;
                $scope.client = data.report.client;
            });
        };
        $scope.$watch('range', $scope.getReport, true);
        $scope.range = {
            beg: moment().startOf('isoWeek').format(),
            end: moment().endOf('isoWeek').format()
        };

        $scope.setPeriod = function () {
            $scope.range.end = $scope.period.getRangeEnd($scope.range.beg);
        };

        $scope.showCalculator = function (amount) {
            calculator.show(amount);
        };

        $scope.sendByEmail = function () {
            clientResource.sendReport($stateParams.clientId, $scope.range);
        };
    }

    function TaskFormController($scope, airyUser, taskResource) {
        $scope.task = angular.copy($scope.ngDialogData.task);

        $scope.submitForm = function () {
            $scope.task.project_id = $scope.$parent.project.id;
            if (!$scope.task.id) {
                $scope.createTask($scope.task);
            } else {
                $scope.updateTask($scope.task);
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
                    angular.extend($scope.ngDialogData.task, data.task);
                    $scope.closeThisDialog();
                }
            });
        };
    }

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
                minutes: duration.minutes()
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
                minutes: duration.minutes()
            };
        };
    }
})();
