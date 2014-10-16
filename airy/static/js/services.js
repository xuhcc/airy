var airyServices = angular.module('airyServices', []);

airyServices.factory('airyUser', function ($http) {
    var user = {};
    var load = function () {
        $http.get('user').success(function (data) {
            angular.extend(user, data.user);
        });
    };
    return {
        user: user,
        load: load
    };
});

airyServices.factory('airyModal', function (ngDialog) {
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
                data: {message: message}
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
                data: {message: message}
            }).then(function (data) {
                if (data == 1) {
                    confirmCallback();
                }
            });
        }
    };
});

airyServices.factory('httpErrorHandler', function ($q, $injector) {
    return {
        'responseError': function (rejection) {
            var airyModal = $injector.get('airyModal');
            var errorMessage = rejection.data.error_msg || 'Server error';
            airyModal.alert(errorMessage);
            return $q.reject(rejection);
        }
    };
});
