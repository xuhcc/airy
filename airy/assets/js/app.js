(function () {
    'use strict';

    angular
        .module('airyApp', [
            'ngSanitize',
            'linkify',
            'ngDialog',
            'cfp.hotkeys',
            'monospaced.elastic',
            'angular-loading-bar',
            'ui.router',
            'airyControllers',
            'airyDirectives',
            'airyFilters',
            'airyServices'
        ])
        .config(routeConfig)
        .config(ngDialogConfig)
        .config(httpConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'static/partials/login.html',
                resolve: {
                    user: function ($q, $state, airyUser) {
                        var deferred = $q.defer();
                        airyUser.userLoaded.then(function () {
                            if (airyUser.user.name) {
                                deferred.reject();
                                $state.go('client_list');
                            } else {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }
                }
            })
            .state('client_list', {
                url: '/clients',
                templateUrl: 'static/partials/clients.html'
            })
            .state('client_detail', {
                url: '/clients/:clientId',
                templateUrl: 'static/partials/client.html'
            })
            .state('timesheet', {
                url: '/clients/:clientId/timesheet',
                templateUrl: 'static/partials/timesheet.html'
            })
            .state('project_detail', {
                url: '/projects/:projectId',
                templateUrl: 'static/partials/project.html'
            })
            .state('project_report', {
                url: '/projects/:projectId/report',
                templateUrl: 'static/partials/report.html'
            })
            .state('report_list', {
                url: '/reports',
                templateUrl: 'static/partials/reports.html'
            });
    }

    function ngDialogConfig(ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'popup'
        });
    }

    function httpConfig($httpProvider) {
        $httpProvider.interceptors.push('httpErrorHandler');
    }
})();
