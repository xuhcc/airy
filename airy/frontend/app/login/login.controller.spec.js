import 'login/login.module.js';

describe('Login controller', function () {
    'use strict';

    var scope;
    var ctrl;
    var airyUser = {
        login: function (password) {
            this.password = password;
        },
    };

    beforeEach(module('airy.login'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('LoginController', {
            $scope: scope,
            airyUser: airyUser,
        });
    }));

    it('should change the page title', function () {
        expect(scope.title).toBe('Login');
    });

    it('should log in the user', function () {
        scope.password = 'pwd';
        scope.loginUser();
        expect(airyUser.password).toBe('pwd');
    });
});
