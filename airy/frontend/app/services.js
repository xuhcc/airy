(function () {
    'use strict';

    angular
        .module('airy.services', [])
        .factory('airyUser', airyUser)
        .factory('airyModal', airyModal)
        .factory('httpErrorHandler', httpErrorHandler);

    function airyUser($http, $state, airyModal) {
        var user = {};
        var load = function () {
            return $http.get('/user').success(function (data) {
                angular.extend(user, data.user);
            });
        };
        var login = function (password) {
            $http.post('/login', {password: password}).success(function (data) {
                if (data.error_msg) {
                    airyModal.alert(data.error_msg);
                } else {
                    angular.extend(user, data.user);
                    $state.go('client_list');
                }
            });
        };
        var logout =  function () {
            $http.get('/logout').success(function (data) {
                for (var prop in user) {
                    delete user[prop];
                }
                $state.go('login');
            });
        };
        return {
            user: user,
            userLoaded: load(),
            reload: load,
            login: login,
            logout: logout,
        };
    }

    function airyModal(ngDialog) {
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

    function httpErrorHandler($q, $injector) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 403) {
                    var airyUser = $injector.get('airyUser');
                    airyUser.logout();
                } else {
                    var airyModal = $injector.get('airyModal');
                    var errorMessage = rejection.data.error_msg || 'Server error';
                    airyModal.alert(errorMessage);
                }
                return $q.reject(rejection);
            },
        };
    }
})();
