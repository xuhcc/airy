import ClientDetailController from 'clients/client_detail.controller.js';

export default angular.module('airy.clientDetail', [])
    .component('clientDetail', {
        templateUrl: 'partials/client_detail.html',
        controller: ClientDetailController,
    });
