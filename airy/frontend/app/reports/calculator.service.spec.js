import 'reports/calculator.module.js';

describe('Calculator service', function () {
    'use strict';

    var calculator;
    var ngDialogMock = {
        open: function () {},
    };

    beforeEach(function () {
        module('airy.calculator', function ($provide) {
            $provide.value('ngDialog', ngDialogMock);
        });
    });
    beforeEach(inject(function (_calculator_) {
        calculator = _calculator_;
    }));

    it('should show calculator', function () {
        spyOn(ngDialogMock, 'open').and.callThrough();
        calculator.show(6000);
        expect(ngDialogMock.open).toHaveBeenCalled();
        var ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
        expect(ngDialogConfig.data.duration).toBe(6000);
    });
});
