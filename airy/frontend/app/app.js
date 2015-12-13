(function () {
    'use strict';

    angular
        .module('airy', [
            'ngSanitize',
            'linkify',
            'ngDialog',
            'cfp.hotkeys',
            'monospaced.elastic',
            'angular-loading-bar',
            'ncy-angular-breadcrumb',
            'ui.router',
            // Application
            'airy.config',
            'airy.directives',
            'airy.filters',
            'airy.services',
            'airy.resources',
            'airy.login',
            'airy.clientList',
            'airy.clientForm',
            'airy.clientDetail',
            'airy.clientTimeSheet',
            'airy.clientReport',
            'airy.projectForm',
            'airy.projectDetail',
            'airy.taskForm',
            'airy.timeEntryForm',
        ]);
})();
