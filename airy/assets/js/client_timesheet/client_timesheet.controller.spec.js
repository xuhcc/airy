describe('Timesheet contoller', function () {
    'use strict';

    var scope;
    var buildCtrl;
    var clientResourceMock = {
        getTimeSheet: function (clientId, range) {
            return {
                success: function (successCallback) {
                    return {timesheet: {data: []}};
                },
            };
        },
        sendTimeSheet: function (clientId, range) {},
    };
    var clientId = 1;

    beforeEach(module('airy.clientTimeSheet'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        buildCtrl = function () {
            return $controller('ClientTimeSheetCtrl', {
                $scope: scope,
                $stateParams: {clientId: clientId},
                clientResource: clientResourceMock,
                calculator: {show: function () {}},
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
            end: '2015-04-12T23:59:59+03:00',
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
