import { LoginController } from './login.controller.js';

export default angular.module('airy.login', [])
    .component('login', {
        templateUrl: 'partials/login.html',
        controller: LoginController,
    });
