function httpErrorHandler($q, $injector) {
    var service = {
        responseError: handleError,
    };
    return service;

    function handleError(rejection) {
        if (rejection.status === 403) {
            var airyUser = $injector.get('airyUser');
            airyUser.logout();
        } else {
            var airyPopup = $injector.get('airyPopup');
            var errorMessage = rejection.data.error_msg || 'Server error';
            airyPopup.alert(errorMessage);
        }
        return $q.reject(rejection);
    }
}

export default httpErrorHandler;
