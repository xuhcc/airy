(function () {
    'use strict';

    angular
        .module('airy.services', [])
        .factory('airyUser', airyUser)
        .factory('httpErrorHandler', httpErrorHandler);

    function airyUser($http, $state, airyPopup) {
        var user = {};
        var load = function () {
            return $http.get('/user').success(function (data) {
                angular.extend(user, data.user);
            });
        };
        var login = function (password) {
            $http.post('/login', {password: password}).success(function (data) {
                if (data.error_msg) {
                    airyPopup.alert(data.error_msg);
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
