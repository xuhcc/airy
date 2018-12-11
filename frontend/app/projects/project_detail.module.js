import ProjectDetailController from 'projects/project_detail.controller.js';

export default angular.module('airy.projectDetail', [])
    .component('projectDetail', {
        templateUrl: 'partials/project_detail.html',
        controller: ProjectDetailController,
    });
