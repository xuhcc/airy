function LoginController($scope, $rootScope, airyUser) {
    $scope.password = '';
    $scope.loginUser = loginUser;

    $rootScope.title = 'Login';

    function loginUser() {
        airyUser.login($scope.password);
    }
}

export default LoginController;
