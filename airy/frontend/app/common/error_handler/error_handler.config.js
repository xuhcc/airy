(function () {
    'use strict';

    angular
        .module('airy.errorHandler')
        .config(httpConfig);

    function httpConfig($httpProvider) {
        $httpProvider.interceptors.push('httpErrorHandler');
    }
})();
