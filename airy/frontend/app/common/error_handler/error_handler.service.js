(function () {
    'use strict';

    angular
        .module('airy.errorHandler')
        .factory('httpErrorHandler', httpErrorHandler);

    function httpErrorHandler($q, $injector) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 403) {
                    var airyUser = $injector.get('airyUser');
                    airyUser.logout();
                } else {
                    var airyPopup = $injector.get('airyPopup');
                    var errorMessage = rejection.data.error_msg || 'Server error';
                    airyPopup.alert(errorMessage);
                }
                return $q.reject(rejection);
            },
        };
    }
})();
