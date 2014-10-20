(function () {
    'use strict';

    angular
        .module('airyApp', [
            'ngRoute',
            'ngSanitize',
            'linkify',
            'zj.namedRoutes',
            'ngDialog',
            'cfp.hotkeys',
            'monospaced.elastic',
            'airyControllers',
            'airyDirectives',
            'airyFilters',
            'airyServices'
        ])
        .config(routeConfig)
        .config(ngDialogConfig)
        .config(httpConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'static/partials/login.html',
                name: 'login',
                resolve: {
                    user: function ($q, $location, airyUser) {
                        var deferred = $q.defer();
                        airyUser.userLoaded.then(function () {
                            if (airyUser.user.name) {
                                deferred.reject();
                                $location.path("/clients");
                            } else {
                                deferred.resolve();
                            }
                        });
                        return deferred.promise;
                    }
                }
            })
            .when('/clients', {
                templateUrl: 'static/partials/clients.html',
                name: 'client_list'
            })
            .when('/clients/:clientId', {
                templateUrl: 'static/partials/client.html',
                name: 'client_detail'
            })
            .when('/projects/:projectId', {
                templateUrl: 'static/partials/project.html',
                name: 'project_detail'
            })
            .when('/projects/:projectId/report', {
                templateUrl: 'static/partials/report.html',
                name: 'project_report'
            })
            .when('/reports', {
                templateUrl: 'static/partials/reports.html',
                name: 'report_list'
            })
            .otherwise({
                redirectTo: '/login'
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
