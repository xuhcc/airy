(function () {
    'use strict';

    angular
        .module('airy')
        .config(httpConfig)
        .config(breadcrumbConfig)
        .config(ngDialogConfig);

    function httpConfig($httpProvider) {
        $httpProvider.interceptors.push('httpErrorHandler');
    }

    function breadcrumbConfig($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            templateUrl: 'static/partials/breadcrumbs.html',
        });
    }

    function ngDialogConfig(ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'popup',
        });
    }
})();
