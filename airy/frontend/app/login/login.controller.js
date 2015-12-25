function LoginController($rootScope, airyUser) {
    const self = this;
    self.password = '';
    self.loginUser = loginUser;

    $rootScope.title = 'Login';

    function loginUser() {
        airyUser.login(self.password);
    }
}

export default LoginController;
