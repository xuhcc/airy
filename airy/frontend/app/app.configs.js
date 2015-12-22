export function httpConfig($httpProvider) {
    $httpProvider.interceptors.push('httpErrorHandler');
}

export function breadcrumbConfig($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        templateUrl: 'static/partials/breadcrumbs.html',
    });
}

export function ngDialogConfig(ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'popup',
    });
}
