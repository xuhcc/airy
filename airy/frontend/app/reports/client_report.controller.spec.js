import 'reports/client_report.module.js';

describe('Task report', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let clientResourceMock = {
        getReport: function (clientId, range) {
            return {
                then: function (successCallback) {
                    successCallback({
                        data: {
                            report: {
                                client: {name: 'test'},
                                projects: [],
                            },
                        },
                    });
                },
            };
        },
        sendReport: function (clientId, range) {},
    };
    let calculatorMock = {
        show: function () {},
    };
    let clientId = 1;

    beforeEach(module('airy.clientReport'));
    beforeEach(inject(function ($componentController, $rootScope) {
        scope = $rootScope.$new();
        buildCtrl = function () {
            return $componentController('clientReport', {
                $scope: scope,
                $stateParams: {clientId: clientId},
                $rootScope: $rootScope,
                clientResource: clientResourceMock,
                calculator: calculatorMock,
            });
        };
    }));

    it('should load the task report', function () {
        let ctrl = buildCtrl();
        expect(ctrl.report).toBeDefined();
        expect(ctrl.client).toBeDefined();
        expect(ctrl.range).toBeDefined();
        expect(ctrl.periods.length).toBe(3);
        expect(ctrl.period).toBeDefined();
        spyOn(clientResourceMock, 'getReport').and.callThrough();
        scope.$digest();
        expect(clientResourceMock.getReport).toHaveBeenCalled();
        expect(clientResourceMock.getReport.calls.argsFor(0)[0]).toBe(clientId);
        expect(clientResourceMock.getReport.calls.argsFor(0)[1]).toBe(ctrl.range);
    });

    it('should reload the task report after changing date range', function () {
        let ctrl = buildCtrl();
        scope.$digest();
        spyOn(clientResourceMock, 'getReport').and.callThrough();
        ctrl.range = {
            beg: '2015-04-06T00:00:00+03:00',
            end: '2015-04-12T23:59:59+03:00',
        };
        scope.$digest();
        expect(clientResourceMock.getReport).toHaveBeenCalled();
    });

    it('should reload the task report after changing range length', function () {
        let ctrl = buildCtrl();
        scope.$digest();
        spyOn(clientResourceMock, 'getReport').and.callThrough();
        ctrl.period = ctrl.periods[1];
        ctrl.setPeriod();
        scope.$digest();
        expect(clientResourceMock.getReport).toHaveBeenCalled();
    });

    it('should show calculator', function () {
        let ctrl = buildCtrl();
        spyOn(calculatorMock, 'show').and.callThrough();
        ctrl.showCalculator(600);
        expect(calculatorMock.show).toHaveBeenCalled();
        expect(calculatorMock.show.calls.argsFor(0)[0]).toBe(600);
    });

    it('should send email', function () {
        let ctrl = buildCtrl();
        spyOn(clientResourceMock, 'sendReport').and.callThrough();
        ctrl.sendByEmail();
        expect(clientResourceMock.sendReport).toHaveBeenCalled();
        expect(clientResourceMock.sendReport.calls.argsFor(0)[0]).toBe(clientId);
        expect(clientResourceMock.sendReport.calls.argsFor(0)[1]).toBe(ctrl.range);
    });
});
