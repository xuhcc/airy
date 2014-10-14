var airyControllers = angular.module('airyControllers', []);

airyControllers.controller('ClientListController', function ($scope, $http, $rootScope) {
    $rootScope.title = 'Clients';
    $scope.clients = [];
    $scope.fetchClients = function () {
        $http.get('api/clients').success(function (data) {
            $scope.clients = data.clients;
        });
    };
    $scope.fetchClients();
});

airyControllers.controller('ClientDetailController', function ($scope, $http, $routeParams, $rootScope) {
    $scope.client = {};
    $scope.projects = [];
    $scope.fetchClient = function () {
        $http.get('api/clients/' + $routeParams.clientId).success(function (data) {
            $rootScope.title = data.client.name;
            $scope.client = data.client;
            $scope.projects = data.projects;
        });
    };
    $scope.fetchClient();
});

airyControllers.controller('ProjectDetailController', function ($scope, $http, $routeParams, $rootScope) {
    $scope.project = {};
    $scope.tasks = [];
    $scope.status = 'active';

    $scope.fetchProject = function () {
        $http({
            method: 'GET',
            url: 'api/projects/' + $routeParams.projectId,
            params: {status: $scope.status}
        }).success(function (data) {
            $rootScope.title = data.project.name;
            $scope.project = data.project;
            $scope.tasks = data.tasks;
        });
    };
    $scope.setStatus = function (status) {
        $scope.status = status;
        $scope.fetchProject();
    };

    $scope.fetchProject();
});

airyControllers.controller('ProjectReportController', function ($scope, $http, $routeParams, $rootScope) {
    $scope.report = {};
    $scope.fetchReport = function () {
        $http({
            method: 'GET',
            url: 'api/projects/' + $routeParams.projectId + '/report'
        }).success(function (data) {
            $rootScope.title = data.report.project.name + ' :: Report';
            $scope.report = data.report;
        });
    };
    $scope.fetchReport();
});

airyControllers.controller('ReportListController', function ($scope, $http, $rootScope) {
    $rootScope.title = 'Reports';
    $scope.reports = [];
    $scope.fetchReports = function () {
        $http({
            method: 'GET',
            url: 'api/reports'
        }).success(function (data) {
            $scope.reports = data.reports;
        });
    };
    $scope.fetchReports();
});
