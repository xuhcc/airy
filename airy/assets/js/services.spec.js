describe('Services', function () {
    'use strict';

    describe('test airyUser factory', function () {
        var httpBackend;
        var airyUser;
        var stateMock;
        var airyModalMock;

        beforeEach(function () {
            module('airy.services', function ($provide) {
                stateMock = jasmine.createSpyObj('state', ['go']);
                $provide.value('$state', stateMock);
                airyModalMock = jasmine.createSpyObj('airyModal', ['alert']);
                $provide.value('airyModal', airyModalMock);
            });
            inject(function ($httpBackend, _airyUser_) {
                httpBackend = $httpBackend;
                airyUser = _airyUser_;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should log in the user', function () {
            var user = {name: 'test'};
            httpBackend.expectGET('/user').respond({user: {}});
            httpBackend.expectPOST('/login').respond({user: user});

            airyUser.login('pwd');
            httpBackend.flush();
            expect(stateMock.go).toHaveBeenCalledWith('client_list');
            expect(airyUser.user.name).toBe(user.name);
        });

        it('should show alert', function () {
            httpBackend.expectGET('/user').respond({user: {}});
            httpBackend.expectPOST('/login').respond({error_msg: 'error'});

            airyUser.login('pwd');
            httpBackend.flush();
            expect(airyModalMock.alert).toHaveBeenCalledWith('error');
        });
    });
});
