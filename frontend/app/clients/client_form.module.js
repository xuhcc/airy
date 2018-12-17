import { ClientCreationController } from './client_form.creation.controller.js';
import { ClientUpdateController } from './client_form.update.controller.js';

export default angular.module('airy.clientForm', [])
    .controller('ClientCreationController', ClientCreationController)
    .controller('ClientUpdateController', ClientUpdateController);
