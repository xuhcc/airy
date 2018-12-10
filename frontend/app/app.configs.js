export function httpConfig($httpProvider) {
    $httpProvider.interceptors.push('httpErrorHandler');
    $httpProvider.interceptors.push(function apiPrefixInterceptor ($q) {
        return {
            request: function (config) {
                const url = config.url;
                // Add url prefix for non-template requests
                if (url.substr(url.length - 5) !== '.html') {
                    config.url = '/api' + url;
                }
                return config || $q.when(config);
            },
        };
    });
}

export function ngDialogConfig(ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'popup',
    });
}
