export function httpErrorHandler($q, $injector) {
    let service = {
        responseError: handleError,
    };
    return service;

    function handleError(rejection) {
        if (rejection.status === 403) {
            let airyUser = $injector.get('airyUser');
            airyUser.logout();
        } else {
            let airyPopup = $injector.get('airyPopup');
            let errorMessage = rejection.data.error_msg || 'Server error';
            airyPopup.alert(errorMessage);
        }
        return $q.reject(rejection);
    }
}
