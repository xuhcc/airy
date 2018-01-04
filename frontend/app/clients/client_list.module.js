import ClientListController from 'clients/client_list.controller.js';

export default angular.module('airy.clientList', [])
    .component('clientList',  {
        templateUrl: 'static/partials/client_list.html',
        controller: ClientListController,
    });
