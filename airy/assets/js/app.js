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
            'airy.config',
            'airy.controllers',
            'airy.directives',
            'airy.filters',
            'airy.services',
        ]);
})();
