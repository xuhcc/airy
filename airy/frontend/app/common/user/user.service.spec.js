import 'common/user/user.module.js';

describe('airyUser factory', function () {
    'use strict';

    var httpBackend;
    var airyUser;
    var stateMock;
    var airyPopupMock;

    beforeEach(function () {
        module('airy.user', function ($provide) {
            stateMock = jasmine.createSpyObj('state', ['go']);
            $provide.value('$state', stateMock);
            airyPopupMock = jasmine.createSpyObj('airyPopup', ['alert']);
            $provide.value('airyPopup', airyPopupMock);
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
        expect(airyPopupMock.alert).toHaveBeenCalledWith('error');
    });
});
