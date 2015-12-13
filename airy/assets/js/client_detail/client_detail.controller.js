(function () {
    'use strict';

    angular
        .module('airy.clientDetail')
        .controller('ClientDetailController', ClientDetailController);

    function ClientDetailController($scope, $stateParams, $rootScope, ngDialog,
                                    hotkeys, airyModal, clientResource, projectResource) {
        $scope.client = {};

        $scope.fetchClient = function () {
            clientResource.get($stateParams.clientId).success(function (data) {
                $rootScope.title = data.client.name;
                $scope.client = data.client;
            });
        };
        $scope.fetchClient();

        $scope.showProjectForm = function (project) {
            ngDialog.open({
                template: 'static/partials/project_form.html',
                controller: 'ProjectFormController',
                scope: $scope,
                data: {project: project},
            });
        };

        $scope.deleteProject = function (project) {
            airyModal.confirm('Delete project?', function () {
                projectResource.delete(project).success(function (data) {
                    $scope.fetchClient();
                });
            });
        };

        hotkeys.add({
            combo: 'alt+a',
            callback: function (event) {
                event.preventDefault();
                $scope.showProjectForm({});
            },
        });
    }
})();
