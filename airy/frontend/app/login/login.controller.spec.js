import 'login/login.module.js';

describe('Login controller', function () {
    'use strict';

    let rootScope;
    let ctrl;
    let airyUser = {
        login: function (password) {
            this.password = password;
        },
    };

    beforeEach(module('airy.login'));
    beforeEach(inject(function ($controller, $rootScope) {
        let scope = $rootScope.$new();
        rootScope = $rootScope.$new();
        ctrl = $controller('LoginController as ctrl', {
            $scope: scope,
            $rootScope: rootScope,
            airyUser: airyUser,
        });
    }));

    it('should change the page title', function () {
        expect(rootScope.title).toBe('Login');
    });

    it('should log in the user', function () {
        ctrl.password = 'pwd';
        ctrl.loginUser();
        expect(airyUser.password).toBe('pwd');
    });
});
