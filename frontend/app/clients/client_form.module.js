import ClientCreationController from 'clients/client_form.creation.controller.js';
import ClientUpdateController from 'clients/client_form.update.controller.js';

export default angular.module('airy.clientForm', [])
    .controller('ClientCreationController', ClientCreationController)
    .controller('ClientUpdateController', ClientUpdateController);
