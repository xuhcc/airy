(function () {
    'use strict';

    angular
        .module('airy.header')
        .config(breadcrumbConfig);

    function breadcrumbConfig($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            templateUrl: 'static/partials/breadcrumbs.html',
        });
    }
})();
