describe('Controllers', function () {
    'use strict';

    var scope;
    var ctrl;

    beforeEach(module('airyControllers'));

    describe('LoginController', function () {
        var airyUser = {
            login: function (password) {
                this.password = password;
            }
        };

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('LoginController', {
                $scope: scope,
                airyUser: airyUser
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
});

describe('Filters', function () {
    'use strict';

    var $filter;

    beforeEach(module('airyFilters'));
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('nl2br', function () {
        var result = $filter('nl2br')('aaa\nbbb');
        expect(result).toBe('aaa<br>bbb');
    });
});
