import 'common/popup/popup.module.js';

describe('Popup service', function () {
    'use strict';

    let airyPopup;
    let ngDialogMock = {
        open: function () {},
        openConfirm: function () {
            return {
                then: function (confirmCallback) {
                    confirmCallback(1);
                },
            };
        },
    };

    beforeEach(function () {
        module('airy.popup', function ($provide) {
            $provide.value('ngDialog', ngDialogMock);
        });
    });
    beforeEach(inject(function (_airyPopup_) {
        airyPopup = _airyPopup_;
    }));

    it('should show alert', function () {
        spyOn(ngDialogMock, 'open').and.callThrough();
        airyPopup.alert('test');
        expect(ngDialogMock.open).toHaveBeenCalled();
        let ngDialogConfig = ngDialogMock.open.calls.argsFor(0)[0];
        expect(ngDialogConfig.data.message).toBe('test');
    });

    it('should show confirm', function () {
        spyOn(ngDialogMock, 'openConfirm').and.callThrough();
        let callback = jasmine.createSpy('callback');
        airyPopup.confirm('test', callback);
        expect(ngDialogMock.openConfirm).toHaveBeenCalled();
        let ngDialogConfig = ngDialogMock.openConfirm.calls.argsFor(0)[0];
        expect(ngDialogConfig.data.message).toBe('test');
        expect(callback).toHaveBeenCalled();
    });
});
