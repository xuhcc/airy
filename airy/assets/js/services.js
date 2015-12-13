(function () {
    'use strict';

    angular
        .module('airy.services', [])
        .factory('airyUser', airyUser)
        .factory('clientResource', clientResource)
        .factory('projectResource', projectResource)
        .factory('taskResource', taskResource)
        .factory('timeEntryResource', timeEntryResource)
        .factory('airyModal', airyModal)
        .factory('calculator', calculator)
        .factory('httpErrorHandler', httpErrorHandler);

    function airyUser($http, $state, airyModal) {
        var user = {};
        var load = function () {
            return $http.get('/user').success(function (data) {
                angular.extend(user, data.user);
            });
        };
        var login = function (password) {
            $http.post('/login', {password: password}).success(function (data) {
                if (data.error_msg) {
                    airyModal.alert(data.error_msg);
                } else {
                    angular.extend(user, data.user);
                    $state.go('client_list');
                }
            });
        };
        var logout =  function () {
            $http.get('/logout').success(function (data) {
                for (var prop in user) {
                    delete user[prop];
                }
                $state.go('login');
            });
        };
        return {
            user: user,
            userLoaded: load(),
            reload: load,
            login: login,
            logout: logout,
        };
    }

    function clientResource($http) {
        var prepare = function (client) {
            return {
                name: client.name,
                contacts: client.contacts,
            };
        };
        return {
            'list': function () {
                return $http.get('/clients');
            },
            'create': function (client) {
                return $http.post('/clients', prepare(client));
            },
            'get': function (client_id) {
                return $http.get('/clients/' + client_id);
            },
            'update': function (client) {
                return $http.put('/clients/' + client.id, prepare(client));
            },
            'delete': function (client) {
                return $http.delete('/clients/' + client.id);
            },
            'getTimeSheet': function (client_id, range) {
                return $http.get(
                    '/clients/' + client_id + '/timesheet',
                    {params: range});
            },
            'sendTimeSheet': function (client_id, range) {
                return $http.post(
                    '/clients/' + client_id + '/timesheet',
                    range);
            },
            'getReport': function (client_id, range) {
                return $http.get(
                    '/clients/' + client_id + '/report',
                    {params: range});
            },
            'sendReport': function (client_id, range) {
                return $http.post(
                    '/clients/' + client_id + '/report',
                    range);
            },
        };
    }

    function projectResource($http) {
        var prepare = function (project) {
            return {
                name: project.name,
                description: project.description,
                client_id: project.client_id,
            };
        };
        return {
            'create': function (project, status) {
                return $http.post('/projects', prepare(project));
            },
            'get': function (project_id, status) {
                return $http.get('/projects/' + project_id, {params: {status: status}});
            },
            'update': function (project) {
                return $http.put('/projects/' + project.id, prepare(project));
            },
            'delete': function (project) {
                return $http.delete('/projects/' + project.id);
            },
        };
    }

    function taskResource($http) {
        var prepare = function (task) {
            return {
                title: task.title,
                description: task.description,
                project_id: task.project_id,
            };
        };
        return {
            'create': function (task) {
                return $http.post('/tasks', prepare(task));
            },
            'update': function (task) {
                return $http.put('/tasks/' + task.id, prepare(task));
            },
            'delete': function (task) {
                return $http.delete('/tasks/' + task.id);
            },
            'toggleStatus': function (task) {
                return $http.post('/tasks/' + task.id + '/status');
            },
        };
    }

    function timeEntryResource($http) {
        var prepare = function (timeEntry) {
            return {
                duration: timeEntry.duration,
                comment: timeEntry.comment,
                task_id: timeEntry.task_id,
            };
        };
        return {
            'create': function (timeEntry) {
                return $http.post('/time_entries', prepare(timeEntry));
            },
            'update': function (timeEntry) {
                return $http.put('/time_entries/' + timeEntry.id, prepare(timeEntry));
            },
            'delete': function (timeEntry) {
                return $http.delete('/time_entries/' + timeEntry.id);
            },
        };
    }

    function airyModal(ngDialog) {
        return {
            alert: function (message) {
                var template = '\
                    <div class="alert">\
                        <div class="alert-message">{{ ngDialogData.message }}</div>\
                        <button class="pure-button" data-ng-click="closeThisDialog()">OK</button>\
                    </div>';
                ngDialog.open({
                    template: template,
                    plain: true,
                    data: {message: message},
                });
            },
            confirm: function (message, confirmCallback) {
                var template = '\
                    <div class="confirm">\
                        <div class="confirm-message">{{ ngDialogData.message }}</div>\
                        <button class="pure-button" data-ng-click="confirm(1)">Yes</button>\
                        <button class="pure-button" data-ng-click="closeThisDialog(0)">No</button>\
                    </div>';
                ngDialog.openConfirm({
                    template: template,
                    plain: true,
                    data: {message: message},
                }).then(function (data) {
                    if (data === 1) {
                        confirmCallback();
                    }
                });
            },
        };
    }

    function calculator(ngDialog) {
        return {
            show: function (duration) {
                var template = '\
                    <form class="pure-form calculator-form">\
                        <fieldset>\
                            <input type="text" class="price" ng-model="price"><!--\
                            --><input type="text" class="result" readonly value="{{ getResult() }}">\
                        </fieldset>\
                    </form>';
                ngDialog.open({
                    template: template,
                    plain: true,
                    controller: function ($scope) {
                        $scope.duration = moment.duration($scope.ngDialogData.duration, 'seconds');
                        $scope.price = 0;
                        $scope.getResult = function () {
                            var hours = $scope.duration.asHours().toFixed(2);
                            var result = hours * parseFloat($scope.price);
                            return hours + ' × ' + $scope.price + ' = ' + result.toFixed(2);
                        };
                    },
                    data: {duration: duration},
                });
            },
        };
    }

    function httpErrorHandler($q, $injector) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 403) {
                    var airyUser = $injector.get('airyUser');
                    airyUser.logout();
                } else {
                    var airyModal = $injector.get('airyModal');
                    var errorMessage = rejection.data.error_msg || 'Server error';
                    airyModal.alert(errorMessage);
                }
                return $q.reject(rejection);
            },
        };
    }
})();
