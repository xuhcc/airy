(function () {
    'use strict';

    angular
        .module('airy.clientDetail')
        .controller('ClientDetailController', ClientDetailController);

    function ClientDetailController($scope, $stateParams, $rootScope, ngDialog,
                                    hotkeys, airyPopup, clientResource, projectResource) {
        $scope.client = {};

        $scope.fetchClient = function () {
            clientResource.get($stateParams.clientId).success(function (data) {
                $rootScope.title = data.client.name;
                $scope.client = data.client;
            });
        };
        $scope.fetchClient();

        $scope.createProject = function () {
            ngDialog.open({
                template: 'static/partials/project_form.html',
                controller: 'ProjectCreationController',
                resolve: {
                    client: function () {
                        return $scope.client;
                    },
                },
            });
        };

        $scope.updateProject = function (project) {
            ngDialog.open({
                template: 'static/partials/project_form.html',
                controller: 'ProjectUpdateController',
                resolve: {
                    project: function () {
                        return project;
                    },
                },
            });
        };

        $scope.deleteProject = function (project) {
            airyPopup.confirm('Delete project?', function () {
                projectResource.delete(project).success(function (data) {
                    $scope.fetchClient();
                });
            });
        };

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                $scope.createProject();
            },
        });
    }
})();
