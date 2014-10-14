var airyApp = angular.module('airyApp', [
    'ngRoute',
    'ngSanitize',
    'linkify',
    'zj.namedRoutes',
    'airyControllers',
    'airyDirectives',
    'airyFilters'
]);


airyApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/clients', {
                templateUrl: 'static/partials/clients.html',
                controller: 'ClientListController',
                name: 'client_list'
            })
            .when('/clients/:clientId', {
                templateUrl: 'static/partials/client.html',
                contoller: 'ClientDetailController',
                name: 'client_detail'
            })
            .when('/projects/:projectId', {
                templateUrl: 'static/partials/project.html',
                contorller: 'ProjectDetailController',
                name: 'project_detail'
            })
            .when('/projects/:projectId/report', {
                templateUrl: 'static/partials/report.html',
                controller: 'ProjectReportController',
                name: 'project_report'
            })
            .when('/reports', {
                templateUrl: 'static/partials/reports.html',
                controller: 'ReportListController',
                name: 'report_list'
            })
            .otherwise({
                redirectTo: '/clients'
            });
    }
]);
