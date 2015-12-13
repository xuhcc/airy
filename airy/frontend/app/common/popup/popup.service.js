(function () {
    'use strict';

    angular
        .module('airy.popup')
        .factory('airyPopup', airyPopup);

    function airyPopup(ngDialog) {
        return {
            alert: function (message) {
                var template = '\
                    <div class="alert">\
                        <div class="alert-message">{{ ngDialogData.message }}</div>\
                        <button class="pure-button" data-ng-click="closeThisDialog()">OK</button>\
                    </div>';
                ngDialog.open({
                    template: template,
                    plain: true,
                    data: {message: message},
                });
            },
            confirm: function (message, confirmCallback) {
                var template = '\
                    <div class="confirm">\
                        <div class="confirm-message">{{ ngDialogData.message }}</div>\
                        <button class="pure-button" data-ng-click="confirm(1)">Yes</button>\
                        <button class="pure-button" data-ng-click="closeThisDialog(0)">No</button>\
                    </div>';
                ngDialog.openConfirm({
                    template: template,
                    plain: true,
                    data: {message: message},
                }).then(function (data) {
                    if (data === 1) {
                        confirmCallback();
                    }
                });
            },
        };
    }
})();
