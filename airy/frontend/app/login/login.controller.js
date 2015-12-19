(function () {
    'use strict';

    angular
        .module('airy.login')
        .controller('LoginController', LoginController);

    function LoginController($scope, $rootScope, airyUser) {
        $scope.password = '';
        $scope.loginUser = loginUser;

        $rootScope.title = 'Login';

        function loginUser() {
            airyUser.login($scope.password);
        }
    }
})();
