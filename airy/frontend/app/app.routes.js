function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'static/partials/login.html',
            resolve: {
                user: function ($q, $state, airyUser) {
                    let deferred = $q.defer();
                    airyUser.userLoaded.then(function () {
                        if (airyUser.user.name) {
                            deferred.reject();
                            $state.go('client_list');
                        } else {
                            deferred.resolve();
                        }
                    });
                    return deferred.promise;
                },
            },
        })
        .state('client_list', {
            url: '/clients',
            templateUrl: 'static/partials/client_list.html',
            controller: 'ClientListController as ctrl',
            ncyBreadcrumb: {
                label: 'h',
            },
        })
        .state('client_detail', {
            url: '/clients/:clientId',
            templateUrl: 'static/partials/client_detail.html',
            controller: 'ClientDetailController',
            ncyBreadcrumb: {
                parent: 'client_list',
                label: '{{ client.name }}',
            },
        })
        .state('client_timesheet', {
            url: '/clients/:clientId/timesheet',
            templateUrl: 'static/partials/client_timesheet.html',
            controller: 'ClientTimeSheetCtrl',
            ncyBreadcrumb: {
                parent: 'client_detail',
                label: 'Timesheet',
            },
        })
        .state('client_report', {
            url: '/clients/:clientId/report',
            templateUrl: 'static/partials/client_report.html',
            controller: 'ClientReportController',
            ncyBreadcrumb: {
                parent: 'client_detail',
                label: 'Task report',
            },
        })
        .state('project_detail', {
            url: '/clients/:clientId/projects/:projectId',
            templateUrl: 'static/partials/project_detail.html',
            controller: 'ProjectDetailController',
            ncyBreadcrumb: {
                parent: 'client_detail',
                label: '{{ project.name }}',
            },
        });
}

export default routeConfig;
