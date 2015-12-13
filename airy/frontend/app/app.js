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
            'airy.header',
            'airy.footer',
            'airy.popup',
            'airy.login',
            'airy.clientList',
            'airy.clientForm',
            'airy.clientDetail',
            'airy.clientTimeSheet',
            'airy.clientReport',
            'airy.rangeSelector',
            'airy.calculator',
            'airy.projectForm',
            'airy.projectDetail',
            'airy.taskForm',
            'airy.timeEntryForm',
        ]);
})();
