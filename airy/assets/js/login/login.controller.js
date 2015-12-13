(function () {
    'use strict';

    angular
        .module('airy.login')
        .controller('LoginController', LoginController);

    function LoginController($scope, $rootScope, airyUser) {
        $rootScope.title = 'Login';

        $scope.loginUser = function () {
            airyUser.login($scope.password);
        };
    }
})();
