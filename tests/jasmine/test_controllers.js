describe('Controllers', function () {
    'use strict';

    beforeEach(module('airyControllers'));

    describe('test login controller', function () {
        var scope;
        var ctrl;
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

    describe('test timesheet controller', function () {
        var scope;
        var buildCtrl;
        var clientResourceMock = {
            getTimeSheet: function (clientId) {
                return {
                    success: function (successCallback) {
                        return {timesheet: {data: []}};
                    }
                };
            }
        };
        var clientId = 1;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            buildCtrl = function () {
                return $controller('TimeSheetCtrl', {
                    $scope: scope,
                    $stateParams: {clientId: clientId},
                    clientResource: clientResourceMock
                });
            };
        }));

        it('should load the timesheet', function () {
            spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
            buildCtrl();
            expect(scope.days.length).toBe(7);
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
            expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[0]).toBe(clientId);
        });

        it('should show the date range', function () {
            buildCtrl();
            scope.timesheet.week_beg = '2015-03-23T00:00:00+03:00';
            expect(scope.getRange()).toBe('23.03.15 — 29.03.15');
        });

        it('should shift the date range back and forward', function () {
            spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
            buildCtrl();
            scope.timesheet.week_beg = '2015-03-23T00:00:00+03:00';

            scope.goBack();
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
            expect(scope.timesheet.week_beg).toBe('2015-03-16T00:00:00+03:00');

            clientResourceMock.getTimeSheet.calls.reset();
            scope.goForward();
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
            expect(scope.timesheet.week_beg).toBe('2015-03-23T00:00:00+03:00');
        });
    });
});
