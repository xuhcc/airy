import { ClientListController } from './client_list.controller.js';

export default angular.module('airy.clientList', [])
    .component('clientList',  {
        templateUrl: 'partials/client_list.html',
        controller: ClientListController,
    });
