function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('login', {
            url: '/login',
            component: 'login',
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
            component: 'clientList',
            ncyBreadcrumb: {
                label: 'h',
            },
        })
        .state('client_detail', {
            url: '/clients/:clientId',
            templateUrl: 'static/partials/client_detail.html',
            controller: 'ClientDetailController as ctrl',
            ncyBreadcrumb: {
                parent: 'client_list',
                label: '{{ ctrl.client.name }}',
            },
        })
        .state('client_timesheet', {
            url: '/clients/:clientId/timesheet',
            templateUrl: 'static/partials/client_timesheet.html',
            controller: 'ClientTimeSheetController as ctrl',
            ncyBreadcrumb: {
                parent: 'client_detail',
                label: 'Timesheet',
            },
        })
        .state('client_report', {
            url: '/clients/:clientId/report',
            templateUrl: 'static/partials/client_report.html',
            controller: 'ClientReportController as ctrl',
            ncyBreadcrumb: {
                parent: 'client_detail',
                label: 'Task report',
            },
        })
        .state('project_detail', {
            url: '/clients/:clientId/projects/:projectId',
            templateUrl: 'static/partials/project_detail.html',
            controller: 'ProjectDetailController as ctrl',
            ncyBreadcrumb: {
                parent: 'client_detail',
                label: '{{ ctrl.project.name }}',
            },
        });
}

export default routeConfig;
