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
            getTimeSheet: function (clientId, range) {
                return {
                    success: function (successCallback) {
                        return {timesheet: {data: []}};
                    }
                };
            },
            sendTimeSheet: function (clientId, range) {}
        };
        var clientId = 1;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            buildCtrl = function () {
                return $controller('ClientTimeSheetCtrl', {
                    $scope: scope,
                    $stateParams: {clientId: clientId},
                    clientResource: clientResourceMock,
                    calculator: {show: function () {}}
                });
            };
        }));

        it('should load the timesheet', function () {
            buildCtrl();
            expect(scope.days.length).toBe(7);
            expect(scope.range).toBeDefined();
            spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
            scope.$digest();
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
            expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[0]).toBe(clientId);
            expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[1]).toBe(scope.range);
        });

        it('should reload the timesheet after changing date range', function () {
            buildCtrl();
            scope.$digest();
            spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
            scope.range = {
                beg: '2015-04-06T00:00:00+03:00',
                end: '2015-04-12T23:59:59+03:00'
            };
            scope.$digest();
            expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
        });

        it('should send timesheet by email', function () {
            buildCtrl();
            scope.$digest();
            spyOn(clientResourceMock, 'sendTimeSheet').and.callThrough();
            scope.sendByEmail();
            expect(clientResourceMock.sendTimeSheet).toHaveBeenCalled();
        });
    });

    describe('test task report controller', function () {
        var scope;
        var buildCtrl;
        var clientResourceMock = {
            getReport: function (clientId, range) {
                return {
                    success: function (successCallback) {
                        return {report: {projects: []}};
                    }
                };
            }
        };
        var clientId = 1;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            buildCtrl = function () {
                return $controller('ClientReportController', {
                    $scope: scope,
                    $stateParams: {clientId: clientId},
                    $rootScope: $rootScope,
                    clientResource: clientResourceMock,
                    calculator: {show: function () {}}
                });
            };
        }));

        it('should load the task report', function () {
            buildCtrl();
            expect(scope.range).toBeDefined();
            expect(scope.periods.length).toBe(2);
            expect(scope.period).toBeDefined();
            spyOn(clientResourceMock, 'getReport').and.callThrough();
            scope.$digest();
            expect(clientResourceMock.getReport).toHaveBeenCalled();
            expect(clientResourceMock.getReport.calls.argsFor(0)[0]).toBe(clientId);
            expect(clientResourceMock.getReport.calls.argsFor(0)[1]).toBe(scope.range);
        });

        it('should reload the task report after changing date range', function () {
            buildCtrl();
            scope.$digest();
            spyOn(clientResourceMock, 'getReport').and.callThrough();
            scope.range = {
                beg: '2015-04-06T00:00:00+03:00',
                end: '2015-04-12T23:59:59+03:00'
            };
            scope.$digest();
            expect(clientResourceMock.getReport).toHaveBeenCalled();
        });

        it('should reload the task report after changing range length', function () {
            buildCtrl();
            scope.$digest();
            spyOn(clientResourceMock, 'getReport').and.callThrough();
            scope.period = scope.periods[1];
            scope.setPeriod();
            scope.$digest();
            expect(clientResourceMock.getReport).toHaveBeenCalled();
        });
    });

    describe('test time entry form controller', function () {
        var scope;
        var buildCtrl;
        var timeEntryResourceMock = {
            create: function (timeEntry) {
                return {
                    success: function (successCallback) {}
                };
            },
            update: function (timeEntry) {
                return {
                    success: function (successCallback) {}
                };
            }
        };

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            buildCtrl = function () {
                return $controller('TimeEntryFormController', {
                    $scope: scope,
                    timeEntryResource: timeEntryResourceMock,
                    airyUser: {}
                });
            };
        }));

        it('should show hours and minutes', function () {
            scope.ngDialogData = {
                timeEntry: {amount: 1.5},
                task: {id: 1}
            };
            buildCtrl();
            expect(scope.time.hours).toBe(1);
            expect(scope.time.minutes).toBe(30);
        });

        it('should add 30 minutes', function () {
            scope.ngDialogData = {
                timeEntry: {},
                task: {id: 1}
            };
            buildCtrl();
            expect(scope.time).toBeUndefined();
            scope.incrementTimeAmount();
            expect(scope.time.hours).toBe(0);
            expect(scope.time.minutes).toBe(30);

            scope.time.minutes = 59;
            scope.incrementTimeAmount();
            expect(scope.time.hours).toBe(1);
            expect(scope.time.minutes).toBe(29);
        });

        it('should create time entry', function () {
            scope.ngDialogData = {
                timeEntry: {},
                task: {id: 3}
            };
            buildCtrl();
            scope.time = {hours: 1, minutes: 30};
            spyOn(timeEntryResourceMock, 'create').and.callThrough();
            scope.submitForm();
            expect(timeEntryResourceMock.create).toHaveBeenCalled();
            var timeEntry = timeEntryResourceMock.create.calls.argsFor(0)[0];
            expect(timeEntry.amount).toBe(1.5);
            expect(timeEntry.task_id).toBe(3);
        });

        it('should update time entry', function () {
            scope.ngDialogData = {
                timeEntry: {id: 1, amount: 1},
                task: {id: 5}
            };
            buildCtrl();
            scope.incrementTimeAmount();
            spyOn(timeEntryResourceMock, 'update').and.callThrough();
            scope.submitForm();
            expect(timeEntryResourceMock.update).toHaveBeenCalled();
            var timeEntry = timeEntryResourceMock.update.calls.argsFor(0)[0];
            expect(timeEntry.amount).toBe(1.5);
            expect(timeEntry.task_id).toBe(5);
        });
    });
});
