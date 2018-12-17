import { ProjectCreationController } from './project_form.creation.controller.js';
import { ProjectUpdateController } from './project_form.update.controller.js';

export default angular.module('airy.projectForm', [])
    .controller('ProjectCreationController', ProjectCreationController)
    .controller('ProjectUpdateController', ProjectUpdateController);
