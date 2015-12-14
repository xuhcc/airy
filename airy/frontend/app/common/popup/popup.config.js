(function () {
    'use strict';

    angular
        .module('airy.popup')
        .config(ngDialogConfig);

    function ngDialogConfig(ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'popup',
        });
    }
})();
