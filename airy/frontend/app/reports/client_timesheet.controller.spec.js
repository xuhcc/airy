import 'reports/client_timesheet.module.js';

describe('Timesheet', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let clientResourceMock = {
        getTimeSheet: function (clientId, range) {
            return {
                success: function (successCallback) {
                    return {timesheet: {data: []}};
                },
            };
        },
        sendTimeSheet: function (clientId, range) {},
    };
    let calculatorMock = {
        show: function () {},
    };
    let clientId = 1;

    beforeEach(module('airy.clientTimeSheet'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        buildCtrl = function () {
            return $controller('ClientTimeSheetController as ctrl', {
                $scope: scope,
                $stateParams: {clientId: clientId},
                $rootScope: {},
                clientResource: clientResourceMock,
                calculator: calculatorMock,
            });
        };
    }));

    it('should load the timesheet', function () {
        let ctrl = buildCtrl();
        expect(ctrl.timesheet).toBeDefined();
        expect(ctrl.client).toBeDefined();
        expect(ctrl.days.length).toBe(7);
        expect(ctrl.range).toBeDefined();
        spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
        scope.$digest();
        expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
        expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[0]).toBe(clientId);
        expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[1]).toBe(ctrl.range);
    });

    it('should reload the timesheet after changing date range', function () {
        let ctrl = buildCtrl();
        scope.$digest();
        spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
        ctrl.range = {
            beg: '2015-04-06T00:00:00+03:00',
            end: '2015-04-12T23:59:59+03:00',
        };
        scope.$digest();
        expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
    });

    it('should show calculator', function () {
        let ctrl = buildCtrl();
        spyOn(calculatorMock, 'show').and.callThrough();
        ctrl.showCalculator(600);
        expect(calculatorMock.show).toHaveBeenCalled();
        expect(calculatorMock.show.calls.argsFor(0)[0]).toBe(600);
    });

    it('should send timesheet by email', function () {
        let ctrl = buildCtrl();
        scope.$digest();
        spyOn(clientResourceMock, 'sendTimeSheet').and.callThrough();
        ctrl.sendByEmail();
        expect(clientResourceMock.sendTimeSheet).toHaveBeenCalled();
    });
});
