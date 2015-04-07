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
            'ncy-angular-breadcrumb',
            'ui.router',
            'airyControllers',
            'airyDirectives',
            'airyFilters',
            'airyServices'
        ])
        .config(routeConfig)
        .config(ngDialogConfig)
        .config(httpConfig)
        .config(breadcrumbConfig);

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
                templateUrl: 'static/partials/clients.html',
                controller: 'ClientListController',
                ncyBreadcrumb: {
                    label: '~'
                }
            })
            .state('client_detail', {
                url: '/clients/:clientId',
                templateUrl: 'static/partials/client.html',
                controller: 'ClientDetailController',
                ncyBreadcrumb: {
                    parent: 'client_list',
                    label: '{{ client.name }}'
                }
            })
            .state('client_timesheet', {
                url: '/clients/:clientId/timesheet',
                templateUrl: 'static/partials/timesheet.html',
                controller: 'ClientTimeSheetCtrl',
                ncyBreadcrumb: {
                    parent: 'client_detail',
                    label: 'Timesheet'
                }
            })
            .state('project_detail', {
                url: '/clients/:clientId/projects/:projectId',
                templateUrl: 'static/partials/project.html',
                controller: 'ProjectDetailController',
                ncyBreadcrumb: {
                    parent: 'client_detail',
                    label: '{{ project.name }}'
                }
            })
            .state('project_report', {
                url: '/clients/:clientId/projects/:projectId/report',
                templateUrl: 'static/partials/report.html',
                controller: 'ProjectReportController',
                ncyBreadcrumb: {
                    parent: 'project_detail',
                    label: 'Task report'
                }
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

    function breadcrumbConfig($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            template: '\
                <ol class="breadcrumbs">\
                    <li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">\
                        <a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>\
                        <span ng-switch-when="false">&nbsp;</span>\
                        <span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>\
                    </li>\
                </ol>'
        });
    }
})();
