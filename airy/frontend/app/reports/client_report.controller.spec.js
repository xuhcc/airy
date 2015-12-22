import 'reports/client_report.module.js';

describe('Task report', function () {
    'use strict';

    var scope;
    var buildCtrl;
    var clientResourceMock = {
        getReport: function (clientId, range) {
            return {
                success: function (successCallback) {
                    return {report: {projects: []}};
                },
            };
        },
        sendReport: function (clientId, range) {},
    };
    var calculatorMock = {
        show: function () {},
    };
    var clientId = 1;

    beforeEach(module('airy.clientReport'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        buildCtrl = function () {
            return $controller('ClientReportController', {
                $scope: scope,
                $stateParams: {clientId: clientId},
                $rootScope: $rootScope,
                clientResource: clientResourceMock,
                calculator: calculatorMock,
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
            end: '2015-04-12T23:59:59+03:00',
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

    it('should show calculator', function () {
        buildCtrl();
        spyOn(calculatorMock, 'show').and.callThrough();
        scope.showCalculator(600);
        expect(calculatorMock.show).toHaveBeenCalled();
        expect(calculatorMock.show.calls.argsFor(0)[0]).toBe(600);
    });

    it('should send email', function () {
        buildCtrl();
        spyOn(clientResourceMock, 'sendReport').and.callThrough();
        scope.sendByEmail();
        expect(clientResourceMock.sendReport).toHaveBeenCalled();
        expect(clientResourceMock.sendReport.calls.argsFor(0)[0]).toBe(clientId);
        expect(clientResourceMock.sendReport.calls.argsFor(0)[1]).toBe(scope.range);
    });
});
