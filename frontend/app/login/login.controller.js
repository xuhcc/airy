class LoginController {

    constructor($rootScope, airyUser) {
        this._airyUser = airyUser;

        this.password = '';

        $rootScope.title = 'Login';
    }

    loginUser() {
        this._airyUser.login(this.password);
    }
}

export default LoginController;
