export function httpConfig($httpProvider) {
    $httpProvider.interceptors.push('httpErrorHandler');
}

export function ngDialogConfig(ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'popup',
    });
}
