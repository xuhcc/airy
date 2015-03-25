describe('Filters', function () {
    'use strict';

    var $filter;

    beforeEach(module('airyFilters'));
    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('nl2br filter', function () {
        var result = $filter('nl2br')('aaa\nbbb');
        expect(result).toBe('aaa<br>bbb');
    });

    it('time filter', function () {
        var result1 = $filter('time')('0.00');
        expect(result1).toBe('0:00');
        var result2 = $filter('time')('2.50');
        expect(result2).toBe('2:30');
        var result3 = $filter('time')('1.166666666');
        expect(result3).toBe('1:10');
    });
});
