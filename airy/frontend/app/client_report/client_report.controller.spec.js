describe('Task report controller', function () {
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
                calculator: {show: function () {}},
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
});
