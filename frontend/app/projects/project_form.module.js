import ProjectCreationController from 'projects/project_form.creation.controller.js';
import ProjectUpdateController from 'projects/project_form.update.controller.js';

export default angular.module('airy.projectForm', [])
    .controller('ProjectCreationController', ProjectCreationController)
    .controller('ProjectUpdateController', ProjectUpdateController);
