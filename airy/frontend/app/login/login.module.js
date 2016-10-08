import LoginController from 'login/login.controller.js';

export default angular.module('airy.login', [])
    .component('login', {
        templateUrl: 'static/partials/login.html',
        controller: LoginController,
    });
