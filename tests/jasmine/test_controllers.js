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
            buildCtrl();
            expect(scope.days.length).toBe(7);
            expect(scope.weekBeg).toBeDefined();
            spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
            scope.$digest();
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
            expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[0]).toBe(clientId);
        });

        it('should reload the timesheet after changing date range', function () {
            buildCtrl();
            scope.$digest();
            spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
            scope.weekBeg = '2015-03-16T00:00:00+03:00';
            scope.$digest();
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
        });
    });

    describe('test task report controller', function () {
        var scope;
        var buildCtrl;
        var reportResourceMock = {
            get: function (projectId) {
                return {
                    success: function (successCallback) {
                        return {report: {tasks: []}};
                    }
                };
            }
        };
        var projectId = 1;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            buildCtrl = function () {
                return $controller('ProjectReportController', {
                    $scope: scope,
                    $stateParams: {projectId: projectId},
                    $rootScope: $rootScope,
                    reportResource: reportResourceMock
                });
            };
        }));

        it('should load the task report', function () {
            buildCtrl();
            expect(scope.weekBeg).toBeDefined();
            spyOn(reportResourceMock, 'get').and.callThrough();
            scope.$digest();
            expect(reportResourceMock.get).toHaveBeenCalled();
            expect(reportResourceMock.get.calls.argsFor(0)[0]).toBe(projectId);
        });

        it('should reload the task report after changing date range', function () {
            buildCtrl();
            scope.$digest();
            spyOn(reportResourceMock, 'get').and.callThrough();
            scope.weekBeg = '2015-03-16T00:00:00+03:00';
            scope.$digest();
            expect(reportResourceMock.get).toHaveBeenCalled();
        });
    });
});
