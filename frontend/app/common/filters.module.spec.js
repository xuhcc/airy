import './filters.module.js';

describe('Filters', function () {
    'use strict';

    let $filter;

    beforeEach(module('airy.filters'));
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('nl2br filter', function () {
        let result = $filter('nl2br')('aaa\nbbb');
        expect(result).toBe('aaa<br>bbb');
    });

    it('time filter', function () {
        let result1 = $filter('time')(0);
        expect(result1).toBe('0:00');
        let result2 = $filter('time')(117000);
        expect(result2).toBe('32:30');
        let result3 = $filter('time')(4200);
        expect(result3).toBe('1:10');
    });

    it('timer filter', function () {
        let result = $filter('timer')(3);
        expect(result).toBe('0:00:03');
    });
});
