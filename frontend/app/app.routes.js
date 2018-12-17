export function routeConfig($stateProvider, $urlRouterProvider) {
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
        })
        .state('client_detail', {
            url: '/clients/:clientId',
            component: 'clientDetail',
        })
        .state('client_timesheet', {
            url: '/clients/:clientId/timesheet',
            component: 'clientTimeSheet',
        })
        .state('client_report', {
            url: '/clients/:clientId/report',
            component: 'clientReport',
        })
        .state('project_detail', {
            url: '/clients/:clientId/projects/:projectId',
            component: 'projectDetail',
        });
}
