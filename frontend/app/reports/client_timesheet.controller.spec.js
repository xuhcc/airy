import './client_timesheet.module.js';
import { PERIODS } from './client_report.controller.js';

describe('Timesheet', function () {
    'use strict';

    let scope;
    let buildCtrl;
    let airyBreadcrumbsMock;
    let clientResourceMock = {
        getTimeSheet: function (clientId, range) {
            return {
                then: function (successCallback) {
                    successCallback({
                        data: {
                            timesheet: {
                                client: {name: 'test'},
                                data: [],
                            },
                        },
                    });
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
    beforeEach(inject(function ($componentController, $rootScope) {
        scope = $rootScope.$new();
        airyBreadcrumbsMock = jasmine.createSpyObj('breadcrumbs', ['add']);
        buildCtrl = function () {
            return $componentController('clientTimeSheet', {
                $scope: scope,
                $stateParams: {clientId: clientId},
                $rootScope: {},
                airyBreadcrumbs: airyBreadcrumbsMock,
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
        expect(ctrl.period).toEqual(PERIODS[0]);
        spyOn(clientResourceMock, 'getTimeSheet').and.callThrough();
        scope.$digest();
        expect(clientResourceMock.getTimeSheet).toHaveBeenCalled();
        expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[0]).toBe(clientId);
        expect(clientResourceMock.getTimeSheet.calls.argsFor(0)[1]).toBe(ctrl.range);
        expect(airyBreadcrumbsMock.add).toHaveBeenCalledTimes(1);
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
